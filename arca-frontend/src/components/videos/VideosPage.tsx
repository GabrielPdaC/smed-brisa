'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { apiFetch, API_URL } from '@/lib/api';
import { usePermissions } from '@/app/context/PermissionsContext';
import { useAuth } from '@/app/context/AuthContext';
import CommentsModal from '@/components/CommentsModal';

interface Video {
    id: number;
    title: string;
    description: string;
    url: string;
    urlThumbnail: string;
    status: string;
    uploadedAt: string;
    schoolId?: number;
    schoolName?: string;
    userId?: number;
    userName?: string;
    repositoryId?: number;
    commentId?: number;
}

interface VideosPageProps {
    showAdminControls?: boolean;
    showAddButton?: boolean;
    usePublicEndpoint?: boolean;
    forceListView?: boolean;
}

// Extrai o ID do vídeo do YouTube a partir da URL
function getYouTubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Gera a URL da thumbnail do YouTube
function getYouTubeThumbnail(url: string): string {
    const videoId = getYouTubeId(url);
    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return '';
}

export default function VideosPage({ showAdminControls = false, showAddButton = false, usePublicEndpoint = false, forceListView = false }: VideosPageProps) {
    const { apiPermissions, loading: permissionsLoading } = usePermissions();
    const { user } = useAuth();
    const [videos, setVideos] = useState<Video[]>([]);
    const [schools, setSchools] = useState<any[]>([]);
    const [repositories, setRepositories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Verificar se tem permissão para aprovar vídeos
    // A permissão vem como /api/videos/** do backend
    const canApprove = apiPermissions.some(perm => {
        const urlPattern = perm.trim();
        // Verifica se a permissão cobre /api/videos/{id}/approve
        if (urlPattern === '/api/videos/**' || urlPattern === '/api/**') {
            return true;
        }
        return urlPattern.includes('/api/videos/') && urlPattern.includes('**');
    });
    
    // Verificar se tem permissão para comentar
    const canComment = apiPermissions.some(perm => {
        const urlPattern = perm.trim();
        return urlPattern === '/api/comments/**' || urlPattern === '/api/**';
    });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterSchool, setFilterSchool] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        url: '',
        urlThumbnail: '',
        repositoryId: '',
        schoolId: ''
    });

    // Carrega schoolId do usuário logado quando abre o formulário
    useEffect(() => {
        if (showForm && !editingId) {
            const storedSchoolId = localStorage.getItem('schoolId');
            const userSchoolId = user?.schoolId?.toString() || storedSchoolId || '';
            if (userSchoolId) {
                setForm(prev => ({ ...prev, schoolId: userSchoolId }));
            }
        }
    }, [showForm, editingId, user]);

    // Verifica se o usuário está logado
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        fetchVideos();
        fetchSchools();
        if (showAddButton) {
            fetchRepositories();
        }
    }, [showAddButton, usePublicEndpoint, showAdminControls, canApprove]);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            // Se tem permissão para aprovar, usa endpoint privado para ver pendentes
            // Caso contrário, usa o endpoint público que só mostra aprovados
            const shouldUsePrivate = canApprove || !usePublicEndpoint;
            const endpoint = shouldUsePrivate ? `${API_URL}/videos` : `${API_URL}/public/videos`;
            const fetchFn = shouldUsePrivate ? apiFetch : fetch;
            const res = await fetchFn(endpoint);
            if (res.ok) {
                const data = await res.json();
                setVideos(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Erro ao carregar vídeos:', error);
        }
        setLoading(false);
    };

    const fetchSchools = async () => {
        try {
            const res = await apiFetch(`${API_URL}/schools`);
            if (res.ok) {
                const data = await res.json();
                setSchools(data);
            }
        } catch (error) {
            console.error('Erro ao carregar escolas:', error);
        }
    };

    const fetchRepositories = async () => {
        try {
            // Tenta buscar da API privada primeiro - apenas repositórios de São Léo em Cine
            const res = await apiFetch(`${API_URL}/repositories?type=SAO_LEO_EM_CINE`);
            if (res.ok) {
                const data = await res.json();
                setRepositories(data);
                return;
            }
            
            // Se falhou (provavelmente 403 - sem permissão), tenta buscar da API pública
            if (res.status === 403 || res.status === 401) {
                console.log('Sem acesso à API privada, buscando repositórios da API pública...');
                const publicRes = await fetch(`${API_URL}/public/repositories?type=SAO_LEO_EM_CINE`);
                if (publicRes.ok) {
                    const data = await publicRes.json();
                    setRepositories(data);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar repositórios da API privada, tentando API pública:', error);
            // Em caso de erro, tenta buscar da API pública
            try {
                const publicRes = await fetch(`${API_URL}/public/repositories?type=SAO_LEO_EM_CINE`);
                if (publicRes.ok) {
                    const data = await publicRes.json();
                    setRepositories(data);
                }
            } catch (publicError) {
                console.error('Erro ao carregar repositórios da API pública:', publicError);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const resetForm = () => {
        const storedSchoolId = localStorage.getItem('schoolId');
        const userSchoolId = user?.schoolId?.toString() || storedSchoolId || '';
        setForm({
            title: '',
            description: '',
            url: '',
            urlThumbnail: '',
            repositoryId: '',
            schoolId: userSchoolId
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        // Usa o userId do usuário logado automaticamente
        const storedUserId = localStorage.getItem('userId');
        const userId = user?.id || (storedUserId ? Number(storedUserId) : null);
        const schoolId = Number(form.schoolId);

        // Validações
        if (!userId) {
            setMessage('Erro: usuário não identificado. Faça login novamente.');
            setMessageType('error');
            return;
        }

        if (!schoolId) {
            setMessage('Erro: seu usuário não está associado a uma escola. Entre em contato com o administrador.');
            setMessageType('error');
            return;
        }

        const payload = {
            title: form.title,
            description: form.description,
            url: form.url,
            repositoryId: Number(form.repositoryId),
            userId: userId,
            schoolId: schoolId
        };

        try {
            if (editingId) {
                const res = await apiFetch(`${API_URL}/videos/${editingId}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        title: payload.title,
                        description: payload.description,
                        url: payload.url,
                        repositoryId: payload.repositoryId
                    }),
                });
                if (res.ok) {
                    setMessage('Vídeo atualizado com sucesso!');
                    setMessageType('success');
                    resetForm();
                    fetchVideos();
                } else {
                    // Tenta extrair mensagem de erro do backend
                    try {
                        const errorData = await res.json();
                        setMessage(errorData.message || errorData.error || 'Erro ao atualizar vídeo.');
                    } catch {
                        setMessage('Erro ao atualizar vídeo.');
                    }
                    setMessageType('error');
                }
            } else {
                const res = await apiFetch(`${API_URL}/videos`, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setMessage('Vídeo cadastrado com sucesso!');
                    setMessageType('success');
                    resetForm();
                    fetchVideos();
                } else {
                    // Tenta extrair mensagem de erro do backend
                    try {
                        const errorData = await res.json();
                        setMessage(errorData.message || errorData.error || 'Erro ao cadastrar vídeo.');
                    } catch {
                        setMessage('Erro ao cadastrar vídeo.');
                    }
                    setMessageType('error');
                }
            }
        } catch (error) {
            setMessage('Erro na conexão com o servidor.');
            setMessageType('error');
        }
    };

    const handleEdit = (video: Video) => {
        setForm({
            title: video.title || '',
            description: video.description || '',
            url: video.url || '',
            urlThumbnail: video.urlThumbnail || '',
            repositoryId: video.repositoryId?.toString() || '',
            schoolId: video.schoolId?.toString() || ''
        });
        setEditingId(video.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Excluir este vídeo?')) return;
        try {
            const res = await apiFetch(`${API_URL}/videos/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessage('Vídeo excluído com sucesso!');
                setMessageType('success');
                fetchVideos();
            } else {
                setMessage('Erro ao excluir vídeo.');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Erro na conexão com o servidor.');
            setMessageType('error');
        }
    };

    const handleApprove = async (id: number) => {
        try {
            const res = await apiFetch(`${API_URL}/videos/${id}/approve`, {
                method: 'PUT'
            });
            if (res.ok) {
                setMessage('Vídeo aprovado!');
                setMessageType('success');
                fetchVideos();
            } else {
                setMessage('Erro ao aprovar vídeo.');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Erro na conexão com o servidor.');
            setMessageType('error');
        }
    };

    const handleReject = async (id: number) => {
        const reason = prompt('Motivo da rejeição (opcional):');
        if (reason === null) return; // Usuário cancelou
        
        try {
            const res = await apiFetch(`${API_URL}/videos/${id}/reject`, {
                method: 'PUT',
                body: reason ? JSON.stringify(reason) : undefined
            });
            if (res.ok) {
                setMessage('Vídeo rejeitado.');
                setMessageType('success');
                fetchVideos();
            } else {
                setMessage('Erro ao rejeitar vídeo.');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Erro na conexão com o servidor.');
            setMessageType('error');
        }
    };

    const handleOpenComments = (video: Video) => {
        setSelectedVideo(video);
        setShowCommentsModal(true);
    };

    const handleCommentAdded = async (commentId: number) => {
        if (!selectedVideo) return;
        
        // Atualiza o vídeo para incluir o primeiro comentário
        try {
            const res = await apiFetch(`${API_URL}/videos/${selectedVideo.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: selectedVideo.title,
                    description: selectedVideo.description,
                    url: selectedVideo.url,
                    repositoryId: selectedVideo.repositoryId,
                    commentId: commentId
                }),
            });
            if (res.ok) {
                fetchVideos();
            }
        } catch (error) {
            console.error('Erro ao atualizar vídeo com comentário:', error);
        }
    };

    const filteredVideos = useMemo(() => {
        return videos.filter(video => {
            const termo = searchTerm.toLowerCase();
            const matchSearch = !termo || 
                video.title?.toLowerCase().includes(termo) ||
                video.description?.toLowerCase().includes(termo) ||
                video.schoolName?.toLowerCase().includes(termo) ||
                video.userName?.toLowerCase().includes(termo);
            
            const matchStatus = !filterStatus || video.status === filterStatus;
            const matchSchool = !filterSchool || video.schoolId?.toString() === filterSchool;
            const matchYear = !filterYear || 
                (video.uploadedAt && new Date(video.uploadedAt).getFullYear().toString() === filterYear);

            // Se não tem permissão para aprovar, não mostra vídeos pendentes
            const canSeePending = canApprove || video.status !== 'PENDING';

            return matchSearch && matchStatus && matchSchool && matchYear && canSeePending;
        });
    }, [videos, searchTerm, filterStatus, filterSchool, filterYear, canApprove]);

    const clearFilters = () => {
        setSearchTerm('');
        setFilterStatus('');
        setFilterSchool('');
        setFilterYear('');
    };

    const hasActiveFilters = searchTerm || filterStatus || filterSchool || filterYear;

    const availableYears = useMemo(() => {
        const years = new Set<number>();
        videos.forEach(video => {
            if (video.uploadedAt) {
                const year = new Date(video.uploadedAt).getFullYear();
                years.add(year);
            }
        });
        return Array.from(years).sort((a, b) => b - a);
    }, [videos]);

    const getStatusPill = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'APPROVED': return { class: 'pub', label: 'Aprovado' };
            case 'PENDING': return { class: 'esc', label: 'Pendente' };
            case 'REJECTED': return { class: 'admin', label: 'Rejeitado' };
            default: return { class: 'pub', label: status };
        }
    };

    useEffect(() => {
        const cards = Array.from(document.querySelectorAll('.card')) as HTMLElement[];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.08 });
        cards.forEach(c => observer.observe(c));

        const grid = document.getElementById('grid');
        
        // Se forceListView estiver ativo, aplica a classe list-view diretamente
        if (forceListView && grid) {
            grid.classList.add('list-view');
        }
        
        // Só adiciona listeners aos botões de toggle se não estiver forçando list view
        if (!forceListView) {
            const toggleBtns = Array.from(document.querySelectorAll('.view-toggle-btn'));
            function onToggleClick(e: Event) {
                toggleBtns.forEach(b => b.classList.remove('active'));
                (e.currentTarget as HTMLElement).classList.add('active');
                const isList = (e.currentTarget as HTMLElement).textContent?.trim() === '≣';
                if (grid) {
                    if (isList) grid.classList.add('list-view'); else grid.classList.remove('list-view');
                }
            }
            toggleBtns.forEach(b => b.addEventListener('click', onToggleClick));

            return () => {
                toggleBtns.forEach(b => b.removeEventListener('click', onToggleClick));
                observer.disconnect();
            };
        }

        return () => {
            observer.disconnect();
        };
    }, [filteredVideos, forceListView]);

    return (
        <div className="main-content">
            <div className="container">
                <main>
                    <header className="header">
                        <div className="logo-box"><i className="fas fa-film" /></div>
                        <div className="header-content">
                            <div className="title">
                                <h1>São Léo em Cine</h1>
                                <p className="description">Repositório de vídeos educacionais e projetos audiovisuais das escolas.</p>
                            </div>

                            <div className="controls">
                                <div className="search-and-filters">
                                    <div className="search modern" role="search" aria-label="Pesquisar vídeos">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <path d="M21 21l-4.35-4.35" stroke="#9aa6b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="11" cy="11" r="6" stroke="#9aa6b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <input 
                                            id="busca" 
                                            type="text" 
                                            placeholder="Buscar vídeos, escolas..." 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="filters">
                                        <select 
                                            className="select modern"
                                            value={filterSchool}
                                            onChange={(e) => setFilterSchool(e.target.value)}
                                        >
                                            <option value="">Todas as escolas</option>
                                            {schools.map(school => (
                                                <option key={school.id} value={school.id}>
                                                    {school.name}
                                                </option>
                                            ))}
                                        </select>
                                        <select 
                                            className="select modern"
                                            value={filterYear}
                                            onChange={(e) => setFilterYear(e.target.value)}
                                        >
                                            <option value="">Todos os anos</option>
                                            {availableYears.map(year => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                        <select 
                                            className="select modern"
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                        >
                                            <option value="">Todos os status</option>
                                            <option value="APPROVED">Aprovado</option>
                                            <option value="PENDING">Pendente</option>
                                            <option value="REJECTED">Rejeitado</option>
                                        </select>
                                        {hasActiveFilters && (
                                            <a 
                                                href="#" 
                                                className="clear-link" 
                                                onClick={(e) => { e.preventDefault(); clearFilters(); }}
                                            >
                                                Limpar filtros
                                            </a>
                                        )}
                                        {showAddButton && isLoggedIn && (
                                            <button 
                                                onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
                                                className="btn download"
                                            >
                                                {showForm ? 'Cancelar' : '+ Novo Vídeo'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {message && (
                        <div style={{
                            background: messageType === 'success' ? '#d1fae5' : '#fee2e2',
                            border: `1px solid ${messageType === 'success' ? '#10b981' : '#ef4444'}`,
                            color: messageType === 'success' ? '#065f46' : '#dc2626',
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 16
                        }}>
                            {message}
                        </div>
                    )}

                    {showForm && showAddButton && isLoggedIn && (
                        <section className="card" style={{ marginBottom: 24 }}>
                            <h3 style={{ marginBottom: 16 }}>
                                {editingId ? 'Editar Vídeo' : 'Novo Vídeo'}
                            </h3>
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label>Título *</label>
                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginTop: 16 }}>
                                    <label>URL do Vídeo *</label>
                                    <input
                                        name="url"
                                        type="url"
                                        value={form.url}
                                        onChange={handleChange}
                                        placeholder="https://youtube.com/watch?v=..."
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginTop: 16 }}>
                                    <label>Descrição</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={3}
                                        style={{ 
                                            width: '100%', 
                                            padding: 12, 
                                            border: '1px solid var(--border-color)', 
                                            borderRadius: 8, 
                                            background: 'var(--card)', 
                                            color: 'var(--foreground)', 
                                            resize: 'vertical' 
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: showAdminControls ? '1fr 1fr' : '1fr', gap: 16, marginTop: 16 }}>
                                    <div className="form-group">
                                        <label>Repositório *</label>
                                        <select
                                            name="repositoryId"
                                            value={form.repositoryId}
                                            onChange={handleChange}
                                            required
                                            className="select modern"
                                            style={{ width: '100%' }}
                                        >
                                            <option value="">Selecione...</option>
                                            {repositories.map(repo => (
                                                <option key={repo.id} value={repo.id}>{repo.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Escola *</label>
                                        <select
                                            name="schoolId"
                                            value={form.schoolId}
                                            onChange={handleChange}
                                            required
                                            disabled={!!(user?.schoolId || localStorage.getItem('schoolId'))}
                                            className="select modern"
                                            style={{ width: '100%' }}
                                        >
                                            <option value="">Selecione...</option>
                                            {schools.map(school => (
                                                <option key={school.id} value={school.id}>{school.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
                                    <button type="button" className="btn" onClick={resetForm}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-login">
                                        {editingId ? 'Atualizar' : 'Cadastrar'}
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}

                    <div className="meta-row">
                        <div>{loading ? 'Carregando...' : `${filteredVideos.length} vídeo(s) encontrado(s)`}</div>
                        {!forceListView && (
                            <div className="view-options">
                                <div className="view-label">Exibir em</div>
                                <div className="view-toggle">
                                    <button className="view-toggle-btn active">▦</button>
                                    <button className="view-toggle-btn">≣</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <section className="grid" id="grid" style={{ marginTop: 28 }}>
                        {loading ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>
                                <p>Carregando vídeos...</p>
                            </div>
                        ) : filteredVideos.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>
                                <p>Nenhum vídeo encontrado.</p>
                                {hasActiveFilters && (
                                    <button 
                                        onClick={clearFilters}
                                        className="btn"
                                        style={{ marginTop: 16 }}
                                    >
                                        Limpar filtros
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredVideos.map((video) => {
                                const statusPill = getStatusPill(video.status);
                                const thumbnail = video.urlThumbnail || getYouTubeThumbnail(video.url);
                                const uploadDate = video.uploadedAt ? new Date(video.uploadedAt).toLocaleDateString('pt-BR') : '';
                                const uploadYear = video.uploadedAt ? new Date(video.uploadedAt).getFullYear() : '';

                                return (
                                    <article className="card video-card" key={video.id}>
                                        {thumbnail && (
                                            <a className="thumb" href={video.url} target="_blank" aria-label={`Assistir ${video.title}`} rel="noreferrer">
                                                <img src={thumbnail} alt={`Miniatura ${video.title}`} />
                                            </a>
                                        )}
                                        <div className="top">
                                            <span className={`pill ${statusPill.class}`}>{statusPill.label}</span>
                                            <div className="file-info">YouTube{uploadYear ? ` · ${uploadYear}` : ''}</div>
                                        </div>
                                        <h3>{video.title}</h3>
                                        <p>{video.description}</p>
                                        <div className="tags">
                                            {video.schoolName && <span className="tag">{video.schoolName}</span>}
                                            {uploadDate && <span className="tag">{uploadDate}</span>}
                                        </div>
                                        <div className="actions">
                                            <div className="small">{video.userName || 'Anônimo'}</div>
                                            <div className="buttons" style={{ flexWrap: 'wrap' }}>
                                                <a className="btn view" href={video.url} target="_blank" rel="noreferrer">
                                                    <i className="fas fa-play" /> Assistir
                                                </a>
                                                {canComment && (
                                                    <button 
                                                        className="btn" 
                                                        onClick={() => handleOpenComments(video)}
                                                        style={{ background: '#3b82f6', color: '#fff' }}
                                                    >
                                                        <i className="fas fa-comment" /> Comentários
                                                    </button>
                                                )}
                                                {canApprove && video.status === 'PENDING' && (
                                                    <>
                                                        <button 
                                                            className="btn" 
                                                            onClick={() => handleApprove(video.id)}
                                                            style={{ background: '#10b981', color: '#fff' }}
                                                        >
                                                            <i className="fas fa-check" /> Aprovar
                                                        </button>
                                                        <button 
                                                            className="btn" 
                                                            onClick={() => handleReject(video.id)}
                                                            style={{ background: '#f59e0b', color: '#fff' }}
                                                        >
                                                            <i className="fas fa-times" /> Rejeitar
                                                        </button>
                                                    </>
                                                )}
                                                {showAdminControls && (
                                                    <>
                                                        <button className="btn" onClick={() => handleEdit(video)}>
                                                            <i className="fas fa-edit" /> Editar
                                                        </button>
                                                        <button 
                                                            className="btn" 
                                                            onClick={() => handleDelete(video.id)} 
                                                            style={{ background: '#dc2626', color: '#fff' }}
                                                        >
                                                            <i className="fas fa-trash" /> Excluir
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </section>
                </main>
            </div>
            
            {/* Modal de Comentários */}
            {showCommentsModal && selectedVideo && (
                <CommentsModal
                    entityType="video"
                    entityId={selectedVideo.id}
                    commentId={selectedVideo.commentId || null}
                    onClose={() => {
                        setShowCommentsModal(false);
                        setSelectedVideo(null);
                    }}
                    onCommentAdded={handleCommentAdded}
                />
            )}
        </div>
    );
}
