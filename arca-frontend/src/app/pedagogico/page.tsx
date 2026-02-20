'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import JournalsPage from '@/components/journals/JournalsPage';
import ArticlesPage from '@/components/articles/ArticlesPage';
import { apiFetch, API_URL } from '@/lib/api';
import { usePermissions } from '@/app/context/PermissionsContext';

interface Journal {
  id: number;
  name?: string;
  repositoryId: number;
  repositoryName: string;
  schoolId: number;
  schoolName: string;
  userId: number;
  userName: string;
  openingDate: string;
  closingDate?: string;
  status: string;
}

interface Article {
  id: number;
  journalId: number;
  authors: string;
  title: string;
  url?: string;
  userId: number;
  userName: string;
  status: string;
  commentId?: number;
  createdAt: string;
}

interface School {
  id: number;
  name: string;
}

export default function Pedagogico() {
    const { apiPermissions } = usePermissions();
    const [journals, setJournals] = useState<Journal[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewType, setViewType] = useState<'all' | 'journals' | 'articles'>('all');
    const [selectedSchool, setSelectedSchool] = useState<string>('all');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // Verificar se tem permissão para criar revistas
    const canCreateJournal = apiPermissions.some(perm => {
        const urlPattern = perm.trim();
        return urlPattern === '/api/journals/**' || urlPattern === '/api/journals' || urlPattern === '/api/**';
    });
    
    const [canCreateArticle, setCanCreateArticle] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Tentar com autenticação, se falhar com 403, usar endpoint público
            let journalsRes = token ? await apiFetch(`${API_URL}/journals`) : await fetch(`${API_URL}/public/journals`);
            if (journalsRes.status === 403) {
                journalsRes = await fetch(`${API_URL}/public/journals`);
            }
            
            let articlesRes = token ? await apiFetch(`${API_URL}/articles`) : await fetch(`${API_URL}/public/articles`);
            if (articlesRes.status === 403) {
                articlesRes = await fetch(`${API_URL}/public/articles`);
                setCanCreateArticle(false);
            } else if (articlesRes.ok) {
                setCanCreateArticle(true);
            }
            
            let schoolsRes = token ? await apiFetch(`${API_URL}/schools`) : await fetch(`${API_URL}/schools`);
            if (schoolsRes.status === 403) {
                schoolsRes = await fetch(`${API_URL}/schools`);
            }

            if (journalsRes.ok) {
                setJournals(await journalsRes.json());
            }
            
            if (articlesRes.ok) {
                setArticles(await articlesRes.json());
            }
            
            if (schoolsRes.ok) {
                setSchools(await schoolsRes.json());
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredJournals = journals.filter(j => {
        const matchesSearch = j.repositoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             j.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            j.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSchool = selectedSchool === 'all' || j.schoolId === parseInt(selectedSchool);
        return matchesSearch && matchesSchool;
    });

    const filteredArticles = articles.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.authors.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtrar artigos pela escola da revista
        if (selectedSchool !== 'all') {
            const articleJournal = journals.find(j => j.id === a.journalId);
            if (!articleJournal || articleJournal.schoolId !== parseInt(selectedSchool)) {
                return false;
            }
        }
        
        return matchesSearch;
    });

    useEffect(() => {
        const cards = Array.from(document.querySelectorAll('.card'));
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.08 });
        cards.forEach(c => observer.observe(c));

        const busca = document.getElementById('busca') as HTMLInputElement | null;
        const cardList = Array.from(document.querySelectorAll('.card')) as HTMLElement[];
        function onInput() {
            const termo = busca?.value ? busca.value.toLowerCase() : '';
            cardList.forEach(card => {
                const texto = (card.textContent || '').toLowerCase();
                card.style.display = texto.includes(termo) ? 'flex' : 'none';
            });
        }
        if (busca) busca.addEventListener('input', onInput);

        // View toggle (grid / list)
        const grid = document.getElementById('grid');
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
            if (busca) busca.removeEventListener('input', onInput);
            toggleBtns.forEach(b => b.removeEventListener('click', onToggleClick));
            observer.disconnect();
        };
    }, []);

    return (
        <div className="main-content">
            <div className="container">
                <header className="header">
                    <div className="logo-box"><i className="fas fa-graduation-cap" /></div>
                    <div className="header-content">
                        <h1>Pedagógico</h1>
                        <p className="description">Repositório de revistas e artigos pedagógicos digitais</p>
                    </div>

                    <div className="controls">
                        <div className="search-and-filters">
                            <div className="search modern">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M21 21l-4.35-4.35" stroke="#9aa6b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="11" cy="11" r="6" stroke="#9aa6b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input 
                                    id="busca" 
                                    type="text" 
                                    placeholder="Buscar revistas e artigos..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="filters">
                                <select 
                                    className="select modern" 
                                    value={viewType}
                                    onChange={(e) => setViewType(e.target.value as 'all' | 'journals' | 'articles')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="all">Todos (Revistas e Artigos)</option>
                                    <option value="journals">Apenas Revistas</option>
                                    <option value="articles">Apenas Artigos</option>
                                </select>
                                <select 
                                    className="select modern" 
                                    value={selectedSchool}
                                    onChange={(e) => setSelectedSchool(e.target.value)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="all">Todas as escolas</option>
                                    {schools.map(school => (
                                        <option key={school.id} value={school.id}>{school.name}</option>
                                    ))}
                                </select>
                                {canCreateJournal && (viewType === 'journals' || viewType === 'all') && (
                                    <Link href="/pedagogico/revistas?create=true" className="btn download">
                                        + Nova Revista
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="meta-row">
                    <div>
                        {loading ? 'Carregando...' : 
                            viewType === 'journals' ? `${filteredJournals.length} revista(s) abertas` :
                            viewType === 'articles' ? `${filteredArticles.length} artigo(s) publicado(s)` :
                            `${filteredJournals.length} revista(s) abertas • ${filteredArticles.length} artigo(s) publicado(s)`
                        }
                    </div>
                    <div className="view-options">
                        <div className="view-label">Exibir em</div>
                        <div className="view-toggle">
                            <button className="view-toggle-btn active">▦</button>
                            <button className="view-toggle-btn">≣</button>
                        </div>
                    </div>
                </div>

                <section className="grid" id="grid">
                    {/* Revistas Abertas */}
                    {(viewType === 'all' || viewType === 'journals') && filteredJournals.map((journal) => (
                        <article key={`journal-${journal.id}`} className="card">
                            <div className="top">
                                <span className="pill pub">Aberta</span>
                                <div className="file-info">Revista</div>
                            </div>
                            <h3>{journal.name || journal.repositoryName}</h3>
                            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
                                Repositório: {journal.repositoryName}
                            </p>
                            <p style={{ color: 'var(--muted)', fontSize: 13 }}>
                                {journal.schoolName} • Responsável: {journal.userName}
                            </p>
                            <p>
                                Período de submissão: {new Date(journal.openingDate).toLocaleDateString('pt-BR')}
                                {journal.closingDate && ` até ${new Date(journal.closingDate).toLocaleDateString('pt-BR')}`}
                            </p>
                            <div className="tags">
                                <span className="tag">Submissões abertas</span>
                                <span className="tag">{journal.schoolName}</span>
                            </div>
                            <div className="actions">
                                <div className="small">Revista #{journal.id}</div>
                                <div className="buttons">
                                    <Link href={`/pedagogico/revistas/${journal.id}`} className="btn view">Ver Revista</Link>
                                </div>
                            </div>
                        </article>
                    ))}

                    {/* Artigos Publicados */}
                    {(viewType === 'all' || viewType === 'articles') && filteredArticles.map((article) => (
                        <article key={`article-${article.id}`} className="card">
                            <div className="top">
                                <span className="pill pub">Publicado</span>
                                <div className="file-info">Artigo</div>
                            </div>
                            <h3>{article.title}</h3>
                            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
                                {article.authors} • {new Date(article.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                            <p>Artigo científico aprovado para publicação na revista #{article.journalId}</p>
                            <div className="tags">
                                <span className="tag">Aprovado</span>
                                <span className="tag">Revista #{article.journalId}</span>
                            </div>
                            <div className="actions">
                                <div className="small">Por {article.userName}</div>
                                <div className="buttons">
                                    <Link href={`/pedagogico/revistas/${article.journalId}/artigo/${article.id}`} className="btn view">Ler Artigo</Link>
                                    {article.url && (
                                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn download" style={{ marginLeft: 8 }}>
                                            <i className="fas fa-external-link-alt" /> Acessar Artigo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}

                    {!loading && filteredJournals.length === 0 && filteredArticles.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                            Nenhuma revista ou artigo encontrado.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
