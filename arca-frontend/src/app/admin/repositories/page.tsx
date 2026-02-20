"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch, API_URL } from "@/lib/api";

export default function RepositoriesPage() {
  const [form, setForm] = useState({ name: "", description: "", type: "CEDOC" });
  const [repositories, setRepositories] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    setLoading(true);
    const res = await apiFetch(`${API_URL}/repositories`);
    if (res.ok) {
      const data = await res.json();
      setRepositories(data);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", description: "", type: "CEDOC" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editingId) {
        const res = await apiFetch(`${API_URL}/repositories/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setMessage("Repositório atualizado com sucesso!");
          setMessageType("success");
          resetForm();
          fetchRepositories();
        } else {
          setMessage("Erro ao atualizar repositório.");
          setMessageType("error");
        }
      } else {
        const res = await apiFetch(`${API_URL}/repositories`, {
          method: "POST",
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setMessage("Repositório cadastrado com sucesso!");
          setMessageType("success");
          resetForm();
          fetchRepositories();
        } else {
          setMessage("Erro ao cadastrar repositório.");
          setMessageType("error");
        }
      }
    } catch {
      setMessage("Erro na conexão com o servidor.");
      setMessageType("error");
    }
  };

  const handleEdit = (repository: any) => {
    setForm({ name: repository.name, description: repository.description || "", type: repository.type || "CEDOC" });
    setEditingId(repository.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este repositório?")) return;
    const res = await apiFetch(`${API_URL}/repositories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessage("Repositório excluído com sucesso!");
      setMessageType("success");
      fetchRepositories();
    } else {
      setMessage("Erro ao excluir repositório.");
      setMessageType("error");
    }
  };

  const filteredRepositories = repositories.filter((r: any) => {
    const termo = searchTerm.toLowerCase();
    return r.name?.toLowerCase().includes(termo) || r.description?.toLowerCase().includes(termo);
  });

  return (
    <div className="main-content">
      <div className="container">
        <header className="header">
          <div className="logo-box"><i className="fas fa-database" /></div>
          <div className="header-content">
            <h1>Gerenciar Repositórios</h1>
            <p className="description">Cadastre e gerencie os repositórios de conteúdo.</p>
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
                  placeholder="Buscar repositórios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filters">
                <Link href="/admin" className="btn">← Voltar</Link>
                <button className="btn download" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
                  {showForm ? "Cancelar" : "+ Novo Repositório"}
                </button>
              </div>
            </div>
          </div>
        </header>

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
            <h3 style={{ marginBottom: 16 }}>{editingId ? "Editar Repositório" : "Novo Repositório"}</h3>
            <form onSubmit={handleSubmit} className="login-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label>Nome *</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Descrição</label>
                  <textarea 
                    name="description" 
                    value={form.description} 
                    onChange={handleChange}
                    rows={3}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Tipo *</label>
                  <select name="type" value={form.type} onChange={handleChange} required className="select modern" style={{ width: '100%' }}>
                    <option value="CEDOC">CEDOC</option>
                    <option value="PEDAGOGICO">Pedagógico</option>
                    <option value="SAO_LEO_EM_CINE">São Léo em Cine</option>
                  </select>
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
          <div>{loading ? "Carregando..." : `${filteredRepositories.length} repositório(s) encontrado(s)`}</div>
        </div>

        <div className="grid">
          {loading ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Carregando...</div>
          ) : filteredRepositories.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Nenhum repositório encontrado.</div>
          ) : (
            filteredRepositories.map((r: any) => (
              <article className="card" key={r.id}>
                <div className="top">
                  <div className="pill pub">{r.type === 'CEDOC' ? 'CEDOC' : r.type === 'PEDAGOGICO' ? 'Pedagógico' : 'São Léo em Cine'}</div>
                  <div className="file-info">{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
                <h3>{r.name}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14 }}>{r.description || "Sem descrição"}</p>
                <div className="actions">
                  <div className="buttons">
                    <button className="btn view" onClick={() => handleEdit(r)}><i className="fas fa-edit" /> Editar</button>
                    <button className="btn" onClick={() => handleDelete(r.id)} style={{ background: "#dc2626", color: "#fff" }}><i className="fas fa-trash" /> Excluir</button>
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
