'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import '../exemplos.css';

export default function Pedagogico() {
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
        <>
            <nav className="nav-header">
                <Link href="/exemplos" className="brand">Repositório Digital</Link>
                <div className="nav-links">
                    <button id="theme-toggle" title="Modo Escuro" aria-label="Alternar modo escuro"><i className="fas fa-moon" /></button>
                    <Link href="/exemplos" className="nav-link">Início</Link>
                    <Link href="/exemplos/cedoc" className="nav-link">Cedoc</Link>
                    <Link href="/exemplos/pedagogico" className="nav-link active">Pedagógico</Link>
                    <Link href="/exemplos/saoleoemcine" className="nav-link">São Léo em Cine</Link>
                    <a href="#" className="btn-entrar">Entrar</a>
                </div>
            </nav>

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
                                    <input id="busca" type="text" placeholder="Buscar documentos..." />
                                </div>
                                <div className="filters">
                                    <div className="select modern">Todas as categorias ▾</div>
                                    <div className="select modern">Todas as escolas ▾</div>
                                    <div className="select modern">Todos os anos ▾</div>
                                    <div className="select modern">Todos os status ▾</div>
                                    <a href="#" className="clear-link">Limpar filtros</a>
                                    <Link href="/exemplos/pedagogico/adicionar" className="btn download" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Adicionar Documento</Link>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="meta-row">
                        <div>6 documento(s) encontrado(s)</div>
                        <div className="view-options">
                            <div className="view-label">Exibir em</div>
                            <div className="view-toggle">
                                <button className="view-toggle-btn active">▦</button>
                                <button className="view-toggle-btn">≣</button>
                            </div>
                        </div>
                    </div>

                    <section className="grid" id="grid">
                        <article className="card">
                            <div className="top">
                                <span className="pill esc">Escola</span>
                                <div className="file-info">PDF · 2.3 MB</div>
                            </div>
                            <h3>Ata da Reunião Pedagógica - Janeiro 2024</h3>
                            <p>Registro da reunião pedagógica mensal com pauta e decisões.</p>
                            <div className="tags">
                                <span className="tag">Reunião</span>
                                <span className="tag">Pedagógico</span>
                            </div>
                            <div className="actions">
                                <div className="small">PDF · 2.3 MB</div>
                                <div className="buttons">
                                    <button className="btn download">Baixar</button>
                                    <button className="btn view">Abrir</button>
                                </div>
                            </div>
                        </article>

                        <article className="card">
                            <div className="top">
                                <span className="pill pub">Público</span>
                                <div className="file-info">PDF · 8.7 MB</div>
                            </div>
                            <h3>Projeto Pedagógico Institucional 2024</h3>
                            <p>Documento completo do Projeto Pedagógico Institucional com diretrizes, objetivos e práticas.</p>
                            <div className="tags">
                                <span className="tag">Projeto</span>
                                <span className="tag">Institucional</span>
                            </div>
                            <div className="actions">
                                <div className="small">PDF · 8.7 MB</div>
                                <div className="buttons">
                                    <button className="btn download">Baixar</button>
                                    <button className="btn view">Abrir</button>
                                </div>
                            </div>
                        </article>

                        <article className="card">
                            <div className="top">
                                <span className="pill pub">Publicado</span>
                                <div className="file-info">Artigo</div>
                            </div>
                            <h3>Metodologias Ativas na Educação Infantil</h3>
                            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>Prof. Ana Silva, Prof. Carlos Santos • 15/01/2025</p>
                            <p>Este artigo explora o uso de metodologias ativas no desenvolvimento cognitivo de crianças na educação infantil.</p>
                            <div className="actions">
                                <div className="small">Publicado</div>
                                <div className="buttons">
                                    <button className="btn download">Abrir no Drive</button>
                                </div>
                            </div>
                        </article>

                        <article className="card">
                            <div className="top">
                                <span className="pill pub">Publicado</span>
                                <div className="file-info">Artigo</div>
                            </div>
                            <h3>Alfabetização Lúdica na Educação Infantil: Jogos e Brincadeiras como Ferramentas de Aprendizagem</h3>
                            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>Maria Fernanda Silva, João Pedro Almeida, Ana Carolina Santos • 15/06/2024</p>
                            <p>Este artigo apresenta uma metodologia inovadora de alfabetização através de jogos e brincadeiras direcionadas para crianças de 4 a 6 anos.</p>
                            <div className="actions">
                                <div className="small">Publicado</div>
                                <div className="buttons">
                                    <button className="btn download">Abrir no Drive</button>
                                </div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>
        </>
    );
}
