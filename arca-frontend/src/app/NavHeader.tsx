'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

export default function NavHeader() {
    const pathname = usePathname();
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    return (
        <nav className="nav-header">
            <Link href="/" className="brand">ARCA</Link>
            <div className="nav-links">
                <button 
                    id="theme-toggle" 
                    title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'} 
                    aria-label="Alternar modo escuro"
                    onClick={toggleTheme}
                >
                    <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} />
                </button>
                <Link href="/" className={`nav-link ${isActive('/') && pathname === '/' ? 'active' : ''}`}>Início</Link>
                <Link href="/cedoc" className={`nav-link ${isActive('/cedoc') ? 'active' : ''}`}>Cedoc</Link>
                <Link href="/pedagogico" className={`nav-link ${isActive('/pedagogico') ? 'active' : ''}`}>Pedagógico</Link>
                <Link href="/saoleoemcine" className={`nav-link ${isActive('/saoleoemcine') ? 'active' : ''}`}>São Léo em Cine</Link>
                
                {isAuthenticated ? (
                    <>
                        <Link href="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>Admin</Link>
                        <span style={{ color: 'var(--muted)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                            👤 {user?.name}
                        </span>
                        <button 
                            onClick={logout}
                            className="btn-entrar"
                            style={{ background: '#dc2626', cursor: 'pointer', border: 'none' }}
                        >
                            Sair
                        </button>
                    </>
                ) : (
                    <Link href="/login" className="btn-entrar">Entrar</Link>
                )}
            </div>
        </nav>
    );
}
