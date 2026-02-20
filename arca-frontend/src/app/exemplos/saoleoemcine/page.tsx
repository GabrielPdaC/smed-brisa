'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import '../exemplos.css';

export default function SaoLeoEmCine() {
    useEffect(() => {
        const cards = Array.from(document.querySelectorAll('.card')) as HTMLElement[];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.08 });
        cards.forEach(c => observer.observe(c));

        const busca = document.getElementById('busca') as HTMLInputElement | null;
        function onInput() {
            const termo = busca?.value ? busca.value.toLowerCase() : '';
            cards.forEach(card => {
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
        <>
            <nav className="nav-header">
                <Link href="/exemplos" className="brand">Repositório Digital</Link>
                <div className="nav-links">
                    <button id="theme-toggle" title="Modo Escuro" aria-label="Alternar modo escuro"><i className="fas fa-moon" /></button>
                    <Link href="/exemplos" className="nav-link">Início</Link>
                    <Link href="/exemplos/cedoc" className="nav-link">Cedoc</Link>
                    <Link href="/exemplos/pedagogico" className="nav-link">Pedagógico</Link>
                    <Link href="/exemplos/saoleoemcine" className="nav-link active">São Léo em Cine</Link>
                    <a href="#" className="btn-entrar">Entrar</a>
                </div>
            </nav>

            <div className="main-content">
                <div className="container">
                    <main>
                        <header className="header">
                            <div className="logo-box"><i className="fas fa-film" /></div>
                            <div className="header-content">
                                <div className="title">
                                    <h1>São Léo em Cine</h1>
                                    <p className="description">Repositório de vídeos educacionais e projetos audiovisuais das escolas por metadados.</p>
                                </div>

                                <div className="controls">
                                    <div className="search-and-filters">
                                        <div className="search modern" role="search" aria-label="Pesquisar vídeos">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                <path d="M21 21l-4.35-4.35" stroke="#9aa6b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                <circle cx="11" cy="11" r="6" stroke="#9aa6b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <input id="busca" type="text" placeholder="Buscar vídeos, escolas..." />
                                        </div>
                                        <div className="filters">
                                            <select className="select modern">
                                                <option>Todas as categorias</option>
                                                <option>Meio Ambiente</option>
                                                <option>Outros</option>
                                            </select>
                                            <select className="select modern">
                                                <option>Todas as escolas</option>
                                                <option>Escola A</option>
                                            </select>
                                            <select className="select modern">
                                                <option>Todos os anos</option>
                                                <option>2026</option>
                                                <option>2025</option>
                                                <option>2024</option>
                                                <option>2023</option>
                                            </select>
                                            <select className="select modern">
                                                <option>Todos os status</option>
                                                <option>Publicado</option>
                                                <option>Aprovado</option>
                                                <option>Pendente</option>
                                                <option>Rejeitado</option>
                                            </select>
                                            <a href="#" className="clear-link">Limpar filtros</a>
                                            <Link href="/exemplos/saoleoemcine/adicionar" className="btn download" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Adicionar Vídeo</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className="meta-row">
                            <div>1 vídeo(s) encontrado(s)</div>
                            <div className="view-options">
                                <div className="view-label">Exibir em</div>
                                <div className="view-toggle">
                                    <button className="view-toggle-btn active">▦</button>
                                    <button className="view-toggle-btn">≣</button>
                                </div>
                            </div>
                        </div>

                        <section className="grid" id="grid" style={{ marginTop: 28 }}>
                            <article className="card video-card">
                                <a className="thumb" href="https://www.youtube.com/watch?v=fq_fkRdk9VE" target="_blank" aria-label="Assistir Vídeo 1" rel="noreferrer">
                                    <img src="https://img.youtube.com/vi/fq_fkRdk9VE/hqdefault.jpg" alt="Miniatura Vídeo 1" />
                                </a>
                                <div className="top">
                                    <span className="pill pub">Canal</span>
                                    <div className="file-info">YouTube · 3:12</div>
                                </div>
                                <h3>Memórias de Vida</h3>
                                <p>Registro da série "Memórias de Vida" — relatos e memórias de estudantes e professores.</p>
                                <div className="tags">
                                    <span className="tag">Meio Ambiente</span>
                                    <span className="tag">Vídeo</span>
                                </div>
                                <div className="actions">
                                    <div className="small">YouTube · 5:12</div>
                                    <div className="buttons">
                                        <a className="btn view" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noreferrer"><i className="fas fa-play" /> Assistir</a>
                                    </div>
                                </div>
                            </article>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
