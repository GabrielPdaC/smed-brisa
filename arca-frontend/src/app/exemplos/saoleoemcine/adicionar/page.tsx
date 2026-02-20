'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../exemplos.css';

export default function AdicionarVideo() {
    const router = useRouter();
    const [link, setLink] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categorias, setCategorias] = useState(['']);
    const [ano, setAno] = useState(String(new Date().getFullYear()));
    const [escola, setEscola] = useState('');

    function updateCategoria(index: number, value: string) {
        const c = [...categorias];
        c[index] = value;
        setCategorias(c);
    }

    function addCategoria() {
        setCategorias([...categorias, '']);
    }

    function removeCategoria(index: number) {
        if (categorias.length === 1) return;
        const c = categorias.filter((_, i) => i !== index);
        setCategorias(c);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Validação simples
        if (!link.trim() || !titulo.trim() || !descricao.trim() || !ano.toString().trim()) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }
        const cleanedCats = categorias.map(s => s.trim()).filter(Boolean);
        if (cleanedCats.length === 0) {
            alert('Adicione ao menos uma categoria.');
            return;
        }

        // Aqui você integraria com uma API ou serviço para persistir o vídeo.
        // Por enquanto simulamos sucesso e retornamos para a listagem.
        alert('Vídeo adicionado com sucesso (simulação).');
        router.push('/exemplos/saoleoemcine');
    }

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
                                    <h1>Adicionar Vídeo</h1>
                                    <p className="description">Preencha os dados abaixo para incluir um novo vídeo em São Léo em Cine.</p>
                                </div>
                            </div>
                        </header>

                        <section className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label>Link (obrigatório)</label>
                                    <input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required />
                                </div>

                                <div className="form-group">
                                    <label>Título do vídeo (obrigatório)</label>
                                    <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required />
                                </div>

                                <div className="form-group">
                                    <label>Descrição (obrigatório)</label>
                                    <textarea rows={4} value={descricao} onChange={e => setDescricao(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--card-elevated)' }} />
                                </div>

                                <div className="form-group">
                                    <label>Categoria(s) (obrigatório)</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {categorias.map((cat, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: 8 }}>
                                                <input type="text" value={cat} onChange={e => updateCategoria(idx, e.target.value)} placeholder={`Categoria ${idx + 1}`} style={{ flex: 1 }} />
                                                <button type="button" className="btn" onClick={() => removeCategoria(idx)} aria-label="Remover categoria">×</button>
                                            </div>
                                        ))}
                                        <div>
                                            <button type="button" className="btn" onClick={addCategoria}>+ Adicionar categoria</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Ano (obrigatório)</label>
                                    <input type="number" inputMode="numeric" pattern="[0-9]*" min="1900" max="2100" step="1" value={ano} onChange={e => setAno(e.target.value)} placeholder={String(new Date().getFullYear())} required />
                                </div>

                                <div className="form-group">
                                    <label>Escola (opcional)</label>
                                    <input type="text" value={escola} onChange={e => setEscola(e.target.value)} placeholder="Nome da escola" />
                                </div>

                                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 6 }}>
                                    <Link href="/exemplos/saoleoemcine" className="btn" style={{ textDecoration: 'none' }}>Cancelar</Link>
                                    <button type="submit" className="btn-login">Salvar vídeo</button>
                                </div>
                            </form>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
