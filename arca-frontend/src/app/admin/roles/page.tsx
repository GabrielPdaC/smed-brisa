
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch, API_URL } from "@/lib/api";

export default function RolesPage() {
  const [form, setForm] = useState({ name: "", description: "" });
  const [roles, setRoles] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    const res = await apiFetch(`${API_URL}/roles`);
    if (res.ok) {
      const data = await res.json();
      setRoles(data);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editingId) {
        const res = await apiFetch(`${API_URL}/roles/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setMessage("Função atualizada com sucesso!");
          setMessageType("success");
          resetForm();
          fetchRoles();
        } else {
          setMessage("Erro ao atualizar função.");
          setMessageType("error");
        }
      } else {
        const res = await apiFetch(`${API_URL}/roles`, {
          method: "POST",
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setMessage("Função cadastrada com sucesso!");
          setMessageType("success");
          resetForm();
          fetchRoles();
        } else {
          setMessage("Erro ao cadastrar função.");
          setMessageType("error");
        }
      }
    } catch {
      setMessage("Erro na conexão com o servidor.");
      setMessageType("error");
    }
  };

  const handleEdit = (role: any) => {
    setForm({ name: role.name, description: role.description });
    setEditingId(role.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta função?")) return;
    const res = await apiFetch(`${API_URL}/roles/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessage("Função excluída com sucesso!");
      setMessageType("success");
      fetchRoles();
    } else {
      setMessage("Erro ao excluir função.");
      setMessageType("error");
    }
  };

  const filteredRoles = roles.filter((r: any) => {
    const termo = searchTerm.toLowerCase();
    return r.name?.toLowerCase().includes(termo) || r.description?.toLowerCase().includes(termo);
  });

  return (
    <div className="main-content">
      <div className="container">
        <header className="header">
          <div className="logo-box"><i className="fas fa-user-tag" /></div>
          <div className="header-content">
            <h1>Gerenciar Funções (Roles)</h1>
            <p className="description">Cadastre e gerencie as funções de usuário do sistema.</p>
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
                  placeholder="Buscar funções..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filters">
                <Link href="/admin" className="btn">← Voltar</Link>
                <button className="btn download" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
                  {showForm ? "Cancelar" : "+ Nova Função"}
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
            <h3 style={{ marginBottom: 16 }}>{editingId ? "Editar Função" : "Nova Função"}</h3>
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
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 16 }}>
                <button type="button" className="btn" onClick={resetForm}>Cancelar</button>
                <button type="submit" className="btn-login">{editingId ? "Atualizar" : "Cadastrar"}</button>
              </div>
            </form>
          </section>
        )}

        <div className="meta-row">
          <div>{loading ? "Carregando..." : `${filteredRoles.length} função(ões) encontrada(s)`}</div>
        </div>

        <div className="grid">
          {loading ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Carregando...</div>
          ) : filteredRoles.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Nenhuma função encontrada.</div>
          ) : (
            filteredRoles.map((r: any) => (
              <article className="card" key={r.id}>
                <div className="top">
                  <div className="pill pub">ID: {r.id}</div>
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
