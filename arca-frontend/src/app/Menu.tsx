"use client";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";

export default function Menu() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav style={{ 
      display: "flex", 
      gap: 16, 
      padding: 16, 
      background: "var(--background)",
      borderBottom: "1px solid #333",
      alignItems: "center",
      flexWrap: "wrap"
    }}>
      <Link href="/">Home</Link>
      <Link href="/public">Página Pública</Link>
      
      {isAuthenticated ? (
        <>
          <Link href="/admin">Administração</Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/admin/schools">Escolas</Link>
          <Link href="/admin/videos">Vídeos</Link>
          <Link href="/admin/journals">Revistas</Link>
          <Link href="/admin/articles">Artigos</Link>
          
          <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ color: "#888", fontSize: 14 }}>
              👤 {user?.name}
            </span>
            <button 
              onClick={logout}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12
              }}
            >
              Sair
            </button>
          </div>
        </>
      ) : (
        <Link 
          href="/login"
          style={{
            marginLeft: "auto",
            background: "#3b82f6",
            color: "white",
            padding: "6px 16px",
            borderRadius: 6,
            fontWeight: 500
          }}
        >
          Login
        </Link>
      )}
    </nav>
  );
}

