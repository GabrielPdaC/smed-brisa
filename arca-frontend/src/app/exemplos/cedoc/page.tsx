'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import '../exemplos.css';

export default function Cedoc() {
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
        <>
            <nav className="nav-header">
                <Link href="/exemplos" className="brand">Repositório Digital</Link>
                <div className="nav-links">
                    <button id="theme-toggle" title="Modo Escuro" aria-label="Alternar modo escuro"><i className="fas fa-moon" /></button>
                    <Link href="/exemplos" className="nav-link">Início</Link>
                    <Link href="/exemplos/cedoc" className="nav-link active">Cedoc</Link>
                    <Link href="/exemplos/pedagogico" className="nav-link">Pedagógico</Link>
                    <Link href="/exemplos/saoleoemcine" className="nav-link">São Léo em Cine</Link>
                    <a href="#" className="btn-entrar">Entrar</a>
                </div>
            </nav>

            <div className="main-content">
                <div className="container">
                    <header className="header">
                        <div className="logo-box"><i className="fas fa-book" /></div>
                        <div className="header-content">
                            <h1>CEDOC - Centro de Documentação</h1>
                            <p className="description">Repositório de documentos institucionais e pedagógicos</p>
                        </div>

                        <div className="controls">
                            <div className="search-and-filters">
                                <div className="search modern" role="search" aria-label="Pesquisar documentos">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path d="M21 21l-4.35-4.35" stroke="#9aa6b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="11" cy="11" r="6" stroke="#9aa6b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <input placeholder="Buscar documentos..." aria-label="Campo de busca de documentos" />
                                </div>
                                <div className="filters">
                                    <div className="select modern" role="combobox" aria-label="Filtrar por categoria" tabIndex={0}>Todas as categorias ▾</div>
                                    <div className="select modern" role="combobox" aria-label="Filtrar por escola" tabIndex={0}>Todas as escolas ▾</div>
                                    <div className="select modern" role="combobox" aria-label="Filtrar por ano" tabIndex={0}>Todos os anos ▾</div>
                                    <div className="select modern" role="combobox" aria-label="Filtrar por status" tabIndex={0}>Todos os status ▾</div>
                                    <a href="#" className="clear-link">Limpar filtros</a>
                                    <Link href="/exemplos/cedoc/adicionar" className="btn download" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Adicionar Documento</Link>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="meta-row">
                        <div>6 documento(s) encontrado(s)</div>
                        <div className="view-options">
                            <div className="view-label">Exibir em</div>
                            <div className="view-toggle">
                                <div className="view-toggle-btn active" role="button" aria-label="Visualização em grade">▦</div>
                                <div className="view-toggle-btn inactive" role="button" aria-label="Visualização em lista">☰</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid">
                        <article className="card" aria-labelledby="card1-title">
                            <div className="top">
                                <div className="pill esc">Escola</div>
                                <div className="file-info"><strong>PDF</strong> · 2.3 MB</div>
                            </div>
                            <h3 id="card1-title">Ata da Reunião Pedagógica - Janeiro 2024</h3>
                            <p>Registro da reunião pedagógica mensal com discussões sobre metodologias de ensino e planejamento do semestre.</p>
                            <div className="tags" aria-hidden>
                                <span className="tag">2024</span>
                                <span className="tag">Escola Municipal São José</span>
                                <span className="tag">reunião</span>
                            </div>
                            <div className="actions">
                                <div className="small">Atas de Reunião</div>
                                <div className="buttons">
                                    <button className="btn download">⬇️ Download</button>
                                    <button className="btn view">👁 Visualizar</button>
                                </div>
                            </div>
                        </article>

                        <article className="card" aria-labelledby="card2-title">
                            <div className="top">
                                <div className="pill pub">Público</div>
                                <div className="file-info"><strong>PDF</strong> · 8.7 MB</div>
                            </div>
                            <h3 id="card2-title">Projeto Pedagógico Institucional 2024</h3>
                            <p>Documento completo do Projeto Pedagógico Institucional com diretrizes, objetivos e metodologias para o ano letivo.</p>
                            <div className="tags" aria-hidden>
                                <span className="tag">2024</span>
                                <span className="tag">ppi</span>
                                <span className="tag">diretrizes</span>
                            </div>
                            <div className="actions">
                                <div className="small">Documentos Pedagógicos</div>
                                <div className="buttons">
                                    <button className="btn download">⬇️ Download</button>
                                    <button className="btn view">👁 Visualizar</button>
                                </div>
                            </div>
                        </article>

                        <article className="card" aria-labelledby="card3-title">
                            <div className="top">
                                <div className="pill admin">Admin</div>
                                <div className="file-info"><strong>XLSX</strong> · 1.8 MB</div>
                            </div>
                            <h3 id="card3-title">Relatório de Gestão Financeira - 1º Trimestre</h3>
                            <p>Relatório detalhado da gestão financeira do primeiro trimestre, incluindo receitas, despesas e investimentos.</p>
                            <div className="tags" aria-hidden>
                                <span className="tag">2024</span>
                                <span className="tag">Colégio Estadual Dom Pedro</span>
                                <span className="tag">financeiro</span>
                            </div>
                            <div className="actions">
                                <div className="small">Relatórios de Gestão</div>
                                <div className="buttons">
                                    <button className="btn download">⬇️ Download</button>
                                    <button className="btn view">👁 Visualizar</button>
                                </div>
                            </div>
                        </article>

                        <article className="card" aria-labelledby="card4-title">
                            <div className="top">
                                <div className="pill esc">Escola</div>
                                <div className="file-info"><strong>PDF</strong> · 1.1 MB</div>
                            </div>
                            <h3 id="card4-title">Plano Anual de Ensino 2024</h3>
                            <p>Plano com metas e cronograma de atividades pedagógicas para o ano letivo.</p>
                            <div className="tags" aria-hidden>
                                <span className="tag">planejamento</span>
                                <span className="tag">ensino</span>
                            </div>
                            <div className="actions">
                                <div className="small">Planejamento</div>
                                <div className="buttons">
                                    <button className="btn download">⬇️ Download</button>
                                    <button className="btn view">👁 Visualizar</button>
                                </div>
                            </div>
                        </article>

                        <article className="card" aria-labelledby="card5-title">
                            <div className="top">
                                <div className="pill pub">Público</div>
                                <div className="file-info"><strong>PDF</strong> · 4.6 MB</div>
                            </div>
                            <h3 id="card5-title">Guia de Boas Práticas - Biblioteca</h3>
                            <p>Manual com procedimentos e recomendações para gestão da biblioteca escolar.</p>
                            <div className="tags" aria-hidden>
                                <span className="tag">biblioteca</span>
                                <span className="tag">manual</span>
                            </div>
                            <div className="actions">
                                <div className="small">Guias</div>
                                <div className="buttons">
                                    <button className="btn download">⬇️ Download</button>
                                    <button className="btn view">👁 Visualizar</button>
                                </div>
                            </div>
                        </article>

                        <article className="card" aria-labelledby="card6-title">
                            <div className="top">
                                <div className="pill esc">Escola</div>
                                <div className="file-info"><strong>PDF</strong> · 2.0 MB</div>
                            </div>
                            <h3 id="card6-title">Calendário Escolar 2024</h3>
                            <p>Calendário com feriados, recessos e datas importantes do ano letivo.</p>
                            <div className="tags" aria-hidden>
                                <span className="tag">calendário</span>
                                <span className="tag">2024</span>
                            </div>
                            <div className="actions">
                                <div className="small">Documentos Institucionais</div>
                                <div className="buttons">
                                    <button className="btn download">⬇️ Download</button>
                                    <button className="btn view">👁 Visualizar</button>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </>
    );
}
