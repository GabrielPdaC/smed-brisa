"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch, API_URL } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";

export default function PermissionsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", description: "", urlApi: "", urlClient: "" });
  const [permissions, setPermissions] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`${API_URL}/permissions`);
      if (res.ok) {
        const data = await res.json();
        setPermissions(data);
      } else if (res.status === 403) {
        setMessage("Acesso negado. Você não tem permissão para visualizar permissões. Faça login como ROOT.");
        setMessageType("error");
      } else if (res.status === 401) {
        setMessage("Sessão expirada. Faça login novamente.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Erro ao buscar permissões:", error);
      setMessage("Erro ao carregar permissões.");
      setMessageType("error");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", description: "", urlApi: "", urlClient: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editingId) {
        const res = await apiFetch(`${API_URL}/permissions/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setMessage("Permissão atualizada com sucesso!");
          setMessageType("success");
          resetForm();
          fetchPermissions();
        } else {
          const errorData = await res.json().catch(() => ({}));
          if (res.status === 403) {
            setMessage("Acesso negado. Você não tem permissão para atualizar permissões. Faça login como ROOT.");
          } else if (res.status === 401) {
            setMessage("Sessão expirada. Faça login novamente.");
          } else {
            setMessage(errorData.message || "Erro ao atualizar permissão.");
          }
          setMessageType("error");
        }
      } else {
        const res = await apiFetch(`${API_URL}/permissions`, {
          method: "POST",
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setMessage("Permissão cadastrada com sucesso!");
          setMessageType("success");
          resetForm();
          fetchPermissions();
        } else {
          const errorData = await res.json().catch(() => ({}));
          if (res.status === 403) {
            setMessage("Acesso negado. Você não tem permissão para cadastrar permissões. Faça login como ROOT.");
          } else if (res.status === 401) {
            setMessage("Sessão expirada. Faça login novamente.");
          } else {
            setMessage(errorData.message || "Erro ao cadastrar permissão.");
          }
          setMessageType("error");
        }
      }
    } catch (error) {
      console.error("Erro ao salvar permissão:", error);
      setMessage("Erro na conexão com o servidor.");
      setMessageType("error");
    }
  };

  const handleEdit = (permission: any) => {
    setForm({ 
      name: permission.name, 
      description: permission.description,
      urlApi: permission.urlApi || "",
      urlClient: permission.urlClient || ""
    });
    setEditingId(permission.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta permissão?")) return;
    try {
      const res = await apiFetch(`${API_URL}/permissions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("Permissão excluída com sucesso!");
        setMessageType("success");
        fetchPermissions();
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setMessage("Acesso negado. Você não tem permissão para excluir permissões. Faça login como ROOT.");
        } else if (res.status === 401) {
          setMessage("Sessão expirada. Faça login novamente.");
        } else {
          setMessage(errorData.message || "Erro ao excluir permissão.");
        }
        setMessageType("error");
      }
    } catch (error) {
      console.error("Erro ao excluir permissão:", error);
      setMessage("Erro na conexão com o servidor.");
      setMessageType("error");
    }
  };

  const filteredPermissions = permissions.filter((p: any) => {
    const termo = searchTerm.toLowerCase();
    return p.name?.toLowerCase().includes(termo) || p.description?.toLowerCase().includes(termo);
  });

  return (
    <div className="main-content">
      <div className="container">
        <header className="header">
          <div className="logo-box"><i className="fas fa-key" /></div>
          <div className="header-content">
            <h1>Gerenciar Permissões</h1>
            <p className="description">Cadastre e gerencie as permissões do sistema.</p>
          </div>
          <div className="controls">
            <div className="search-and-filters">
              <div className="search modern">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.35-4.35" stroke="#9aa6b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11" cy="11" r="6" stroke="#9aa6b2" strokeWidth="1.6" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar permissões..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filters">
                <Link href="/admin" className="btn">← Voltar</Link>
                <button className="btn download" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
                  {showForm ? "Cancelar" : "+ Nova Permissão"}
                </button>
              </div>
            </div>
          </div>
        </header>

        {user && user.email !== 'root@arca.com' && (
          <div style={{
            background: "rgba(251, 191, 36, 0.1)",
            border: "1px solid rgba(251, 191, 36, 0.4)",
            color: "var(--text)",
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            <span style={{ fontSize: 24 }}>⚠️</span>
            <div>
              <strong>Atenção:</strong> Você está logado como <strong>{user.email}</strong>.
              <br />
              Para gerenciar permissões, você precisa fazer login como <strong>root@arca.com</strong>.
              <br />
              Se tentar criar, editar ou excluir permissões, receberá erro 403 (Acesso Negado).
            </div>
          </div>
        )}

        {message && (
          <div style={{
            background: messageType === "success" ? "#d1fae5" : "#fee2e2",
            border: `1px solid ${messageType === "success" ? "#10b981" : "#ef4444"}`,
            color: messageType === "success" ? "#065f46" : "#dc2626",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16
          }}>
            {message}
          </div>
        )}

        {showForm && (
          <section className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>{editingId ? "Editar Permissão" : "Nova Permissão"}</h3>
            <form onSubmit={handleSubmit} className="login-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
                <div className="form-group">
                  <label>Nome</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Descrição</label>
                  <input name="description" value={form.description} onChange={handleChange} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                <div className="form-group">
                  <label>URL API</label>
                  <input name="urlApi" value={form.urlApi} onChange={handleChange} placeholder="/api/endpoint" />
                </div>
                <div className="form-group">
                  <label>URL Client</label>
                  <input name="urlClient" value={form.urlClient} onChange={handleChange} placeholder="/client/path" />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 16 }}>
                <button type="button" className="btn" onClick={resetForm}>Cancelar</button>
                <button type="submit" className="btn-login">{editingId ? "Atualizar" : "Cadastrar"}</button>
              </div>
            </form>
          </section>
        )}

        <div className="meta-row">
          <div>{loading ? "Carregando..." : `${filteredPermissions.length} permissão(ões) encontrada(s)`}</div>
        </div>

        <div className="grid">
          {loading ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Carregando...</div>
          ) : filteredPermissions.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Nenhuma permissão encontrada.</div>
          ) : (
            filteredPermissions.map((p: any) => (
              <article className="card" key={p.id}>
                <div className="top">
                  <div className="pill pub">ID: {p.id}</div>
                </div>
                <h3>{p.name}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14 }}>{p.description || "Sem descrição"}</p>
                {(p.urlApi || p.urlClient) && (
                  <div style={{ fontSize: 13, marginTop: 8, color: "var(--muted)" }}>
                    {p.urlApi && <div><strong>API:</strong> {p.urlApi}</div>}
                    {p.urlClient && <div><strong>Client:</strong> {p.urlClient}</div>}
                  </div>
                )}
                <div className="actions">
                  <div className="buttons">
                    <button className="btn view" onClick={() => handleEdit(p)}><i className="fas fa-edit" /> Editar</button>
                    <button className="btn" onClick={() => handleDelete(p.id)} style={{ background: "#dc2626", color: "#fff" }}><i className="fas fa-trash" /> Excluir</button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
