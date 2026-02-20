'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface Stats {
    schools: number;
    journals: number;
    articles: number;
    videos: number;
}

export default function Home() {
    const [stats, setStats] = useState<Stats>({
        schools: 0,
        journals: 0,
        articles: 0,
        videos: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch(`${API_URL}/api/public/stats`);
                
                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        schools: data.schools || 0,
                        journals: data.journals || 0,
                        articles: data.articles || 0,
                        videos: data.videos || 0
                    });
                }
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    return (
        <div className="main-content">
            <div className="container">
                <header className="header">
                    <div className="logo-box"><i className="fas fa-server" /></div>
                    <h1>Repositório Digital</h1>
                    <p className="description">Sistema integrado para gestão de documentos educacionais, artigos pedagógicos e conteúdo audiovisual das instituições de ensino.</p>
                </header>

                <div className="meta-row">
                    <div style={{ display: 'flex', gap: 24, width: '100%', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>
                                {loading ? '...' : stats.schools}
                            </div>
                            <div style={{ color: 'var(--muted)', fontSize: 14 }}>Escolas</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>
                                {loading ? '...' : stats.journals}
                            </div>
                            <div style={{ color: 'var(--muted)', fontSize: 14 }}>Revistas</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>
                                {loading ? '...' : stats.articles}
                            </div>
                            <div style={{ color: 'var(--muted)', fontSize: 14 }}>Artigos</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>
                                {loading ? '...' : stats.videos}
                            </div>
                            <div style={{ color: 'var(--muted)', fontSize: 14 }}>Vídeos</div>
                        </div>
                    </div>
                </div>

                <div className="grid">
                    <article className="card">
                        <div className="top">
                            <div style={{ fontSize: 24, color: 'var(--primary)' }}><i className="fas fa-book" /></div>
                        </div>
                        <h3>CEDOC</h3>
                        <p>Centro de Documentação com históricos escolares, atas e certificados</p>
                        <div className="tags">
                            <span className="tag">Documentos Históricos</span>
                            <span className="tag">Atas de Resultados</span>
                            <span className="tag">Acesso Restrito</span>
                        </div>
                        <div className="actions">
                            <div className="buttons">
                                <Link href="/cedoc" className="btn download" style={{ color: '#2563eb', textDecoration: 'none', background: '#eef6ff' }}>Acessar CEDOC</Link>
                            </div>
                        </div>
                    </article>

                    <article className="card">
                        <div className="top">
                            <div style={{ fontSize: 24, color: '#0b8a3e' }}><i className="fas fa-graduation-cap" /></div>
                        </div>
                        <h3>Pedagógico</h3>
                        <p>Repositório de artigos e revistas educacionais por categoria</p>
                        <div className="tags">
                            <span className="tag">Educação Infantil</span>
                            <span className="tag">Anos Iniciais</span>
                            <span className="tag">Anos Finais</span>
                        </div>
                        <div className="actions">
                            <div className="buttons">
                                <Link href="/pedagogico" className="btn download" style={{ color: '#0b8a3e', textDecoration: 'none', background: '#e8f8ee' }}>Acessar Pedagógico</Link>
                            </div>
                        </div>
                    </article>

                    <article className="card">
                        <div className="top">
                            <div style={{ fontSize: 24, color: '#6b2fb5' }}><i className="fas fa-film" /></div>
                        </div>
                        <h3>São Léo em Cine</h3>
                        <p>Repositório de vídeos educacionais e projetos escolares</p>
                        <div className="tags">
                            <span className="tag">Vídeos Educacionais</span>
                            <span className="tag">Projetos Escolares</span>
                            <span className="tag">YouTube</span>
                        </div>
                        <div className="actions">
                            <div className="buttons">
                                <Link href="/saoleoemcine" className="btn download" style={{ color: '#6b2fb5', textDecoration: 'none', background: '#f3eaff' }}>Acessar São Léo em Cine</Link>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}
