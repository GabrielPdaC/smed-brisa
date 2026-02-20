'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { apiFetch, API_URL } from '@/lib/api';

interface Document {
    id: number;
    title: string;
    description: string;
    link: string;
    userName: string;
    categoryName: string;
    schoolName?: string;
    repositoryName: string;
    createdAt: string;
}

interface DocumentsPageProps {
    showAdminControls?: boolean;
    showAddButton?: boolean;
}

export default function DocumentsPage({ showAdminControls = false, showAddButton = false }: DocumentsPageProps) {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [schools, setSchools] = useState<any[]>([]);
    const [repositories, setRepositories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterSchool, setFilterSchool] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [form, setForm] = useState({
        title: '',
        description: '',
        link: '',
        categoryId: '',
        schoolId: '',
        repositoryId: ''
    });

    useEffect(() => {
        fetchDocuments();
        fetchCategories();
        fetchSchools();
        if (showAddButton) {
            fetchRepositories();
        }
    }, [showAddButton]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(`${API_URL}/documents`);
            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error('Erro ao carregar documentos:', error);
        }
        setLoading(false);
    };

    const fetchCategories = async () => {
        try {
            const res = await apiFetch(`${API_URL}/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    };

    const fetchSchools = async () => {
        try {
            const res = await apiFetch(`${API_URL}/users/schools`);
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
            const res = await apiFetch(`${API_URL}/repositories?type=CEDOC`);
            if (res.ok) {
                const data = await res.json();
                setRepositories(data);
            }
        } catch (error) {
            console.error('Erro ao carregar repositórios:', error);
        }
    };



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const resetForm = () => {
        setForm({
            title: '',
            description: '',
            link: '',
            categoryId: '',
            schoolId: '',
            repositoryId: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        const userId = localStorage.getItem('userId');
        if (!userId) {
            setMessage('Erro: usuário não identificado. Faça login novamente.');
            setMessageType('error');
            return;
        }

        const payload = {
            title: form.title,
            description: form.description,
            link: form.link,
            categoryId: Number(form.categoryId),
            schoolId: form.schoolId ? Number(form.schoolId) : null,
            repositoryId: Number(form.repositoryId),
            userId: Number(userId)
        };

        try {
            if (editingId) {
                const res = await apiFetch(`${API_URL}/documents/${editingId}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setMessage('Documento atualizado com sucesso!');
                    setMessageType('success');
                    resetForm();
                    fetchDocuments();
                } else {
                    setMessage('Erro ao atualizar documento.');
                    setMessageType('error');
                }
            } else {
                const res = await apiFetch(`${API_URL}/documents`, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setMessage('Documento cadastrado com sucesso!');
                    setMessageType('success');
                    resetForm();
                    fetchDocuments();
                } else {
                    setMessage('Erro ao cadastrar documento.');
                    setMessageType('error');
                }
            }
        } catch (error) {
            setMessage('Erro na conexão com o servidor.');
            setMessageType('error');
        }
    };

    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            const matchSearch = !searchTerm || 
                doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchCategory = !filterCategory || doc.categoryName === filterCategory;
            const matchSchool = !filterSchool || doc.schoolName === filterSchool;
            const matchYear = !filterYear || 
                (doc.createdAt && new Date(doc.createdAt).getFullYear().toString() === filterYear);

            return matchSearch && matchCategory && matchSchool && matchYear;
        });
    }, [documents, searchTerm, filterCategory, filterSchool, filterYear]);

    const clearFilters = () => {
        setSearchTerm('');
        setFilterCategory('');
        setFilterSchool('');
        setFilterYear('');
    };

    const getFileExtension = (link: string) => {
        const ext = link.split('.').pop()?.toUpperCase();
        return ext || 'LINK';
    };

    const years = Array.from(new Set(documents.map(d => 
        d.createdAt ? new Date(d.createdAt).getFullYear().toString() : ''
    ).filter(Boolean)));

    useEffect(() => {
        // View toggle logic
        const grid = document.querySelector('.grid');
        const toggleBtns = Array.from(document.querySelectorAll('.view-toggle-btn'));
        function onToggleClick(e: Event) {
            toggleBtns.forEach(b => b.classList.remove('active'));
            (e.currentTarget as HTMLElement).classList.add('active');
            const isList = (e.currentTarget as HTMLElement).textContent && (e.currentTarget as HTMLElement).textContent?.trim() !== '▦';
            if (grid) {
                if (isList) grid.classList.add('list-view'); else grid.classList.remove('list-view');
            }
        }
        toggleBtns.forEach(b => b.addEventListener('click', onToggleClick));
        return () => toggleBtns.forEach(b => b.removeEventListener('click', onToggleClick));
    }, []);

    return (
        <div className="main-content">
            <div className="container">
                <header className="header">
                    <div className="logo-box"><i className="fas fa-book" /></div>
                    <div className="header-content">
                        <h1>CEDOC - Centro de Documentação</h1>
                        <p className="description">Repositório de documentos institucionais e pedagógicos</p>
                    </div>

                    {showAddButton && (
                        <button 
                            onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
                            className="btn download"
                        >
                            {showForm ? 'Cancelar' : '+ Novo Documento'}
                        </button>
                    )}

                    <div className="controls">
                        <div className="search-and-filters">
                            <div className="search modern" role="search" aria-label="Pesquisar documentos">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M21 21l-4.35-4.35" stroke="#9aa6b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="11" cy="11" r="6" stroke="#9aa6b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input 
                                    placeholder="Buscar documentos..." 
                                    aria-label="Campo de busca de documentos"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="filters">
                                <select 
                                    className="select modern" 
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    aria-label="Filtrar por categoria"
                                >
                                    <option value="">Todas as categorias</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                                <select 
                                    className="select modern" 
                                    value={filterSchool}
                                    onChange={(e) => setFilterSchool(e.target.value)}
                                    aria-label="Filtrar por escola"
                                >
                                    <option value="">Todas as escolas</option>
                                    {schools.map(school => (
                                        <option key={school.id} value={school.name}>{school.name}</option>
                                    ))}
                                </select>
                                <select 
                                    className="select modern" 
                                    value={filterYear}
                                    onChange={(e) => setFilterYear(e.target.value)}
                                    aria-label="Filtrar por ano"
                                >
                                    <option value="">Todos os anos</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                {(searchTerm || filterCategory || filterSchool || filterYear) && (
                                    <button 
                                        onClick={clearFilters}
                                        className="btn secondary"
                                        style={{ marginLeft: 8 }}
                                    >
                                        Limpar filtros
                                    </button>
                                )}
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

                {showForm && showAddButton && (
                    <section className="card" style={{ marginBottom: 24 }}>
                        <h3 style={{ marginBottom: 16 }}>
                            {editingId ? 'Editar Documento' : 'Novo Documento'}
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
                                <label>Link do Documento *</label>
                                <input
                                    name="link"
                                    type="url"
                                    value={form.link}
                                    onChange={handleChange}
                                    placeholder="https://example.com/document.pdf"
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                                <div className="form-group">
                                    <label>Categoria *</label>
                                    <select
                                        name="categoryId"
                                        value={form.categoryId}
                                        onChange={handleChange}
                                        required
                                        className="select modern"
                                        style={{ width: '100%' }}
                                    >
                                        <option value="">Selecione...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
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
                            </div>

                            <div className="form-group" style={{ marginTop: 16 }}>
                                <label>Escola</label>
                                <select
                                    name="schoolId"
                                    value={form.schoolId}
                                    onChange={handleChange}
                                    className="select modern"
                                    style={{ width: '100%' }}
                                >
                                    <option value="">Nenhuma (documento geral)</option>
                                    {schools.map(school => (
                                        <option key={school.id} value={school.id}>{school.name}</option>
                                    ))}
                                </select>
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
                    <div>{loading ? 'Carregando...' : `${filteredDocuments.length} documento(s) encontrado(s)`}</div>
                    <div className="view-options">
                        <div className="view-label">Exibir em</div>
                        <div className="view-toggle">
                            <button className="view-toggle-btn active" aria-label="Visualização em grade">▦</button>
                            <button className="view-toggle-btn" aria-label="Visualização em lista">≣</button>
                        </div>
                    </div>
                </div>

                <section className="grid" role="list">
                    {filteredDocuments.map((doc) => (
                        <article key={doc.id} className="card" role="listitem">
                            <div className="top">
                                <span className="pill pub">{getFileExtension(doc.link)}</span>
                            </div>
                            <h3>{doc.title}</h3>
                            <p>{doc.description}</p>
                            <div className="tags">
                                <span className="tag">{doc.categoryName}</span>
                                {doc.schoolName && <span className="tag">{doc.schoolName}</span>}
                                <span className="tag">{doc.repositoryName}</span>
                            </div>
                            <div className="actions">
                                <div className="small">
                                    Por {doc.userName} • {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                                </div>
                                <div className="buttons">
                                    <a 
                                        href={doc.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn download"
                                    >
                                        Abrir Documento
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                    {!loading && filteredDocuments.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                            Nenhum documento encontrado.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
