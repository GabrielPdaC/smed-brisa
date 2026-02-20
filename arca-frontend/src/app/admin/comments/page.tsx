"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch, API_URL } from "@/lib/api";

interface Comment {
  id: number;
  userId: number;
  userName: string;
  comment: string;
  nextCommentId?: number;
  createdAt: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    comment: "",
    nextCommentId: "",
  });

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`${API_URL}/comments`);
      if (res.ok) setComments(await res.json());
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const userId = localStorage.getItem("userId");

    const body = {
      userId: parseInt(userId || "1"),
      comment: form.comment,
      ...(form.nextCommentId && { nextCommentId: parseInt(form.nextCommentId) }),
    };

    try {
      const url = editingId ? `${API_URL}/comments/${editingId}` : `${API_URL}/comments`;
      const res = await apiFetch(url, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMessage(editingId ? "Comentário atualizado!" : "Comentário criado!");
        setMessageType("success");
        resetForm();
        fetchComments();
      } else {
        setMessage("Erro ao salvar comentário.");
        setMessageType("error");
      }
    } catch {
      setMessage("Erro de conexão.");
      setMessageType("error");
    }
  };

  const handleEdit = (comment: Comment) => {
    setForm({
      comment: comment.comment,
      nextCommentId: comment.nextCommentId?.toString() || "",
    });
    setEditingId(comment.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este comentário?")) return;
    try {
      const res = await apiFetch(`${API_URL}/comments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Comentário excluído!");
        setMessageType("success");
        fetchComments();
      } else {
        setMessage("Erro ao excluir.");
        setMessageType("error");
      }
    } catch {
      setMessage("Erro de conexão.");
      setMessageType("error");
    }
  };

  const resetForm = () => {
    setForm({ comment: "", nextCommentId: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredComments = comments.filter((c) => {
    const termo = searchTerm.toLowerCase();
    return c.comment?.toLowerCase().includes(termo) || c.userName?.toLowerCase().includes(termo);
  });

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("pt-BR");

  return (
    <div className="main-content">
      <div className="container">
        <header className="header">
          <div className="logo-box"><i className="fas fa-comments" /></div>
          <div className="header-content">
            <h1>Gerenciar Comentários</h1>
            <p className="description">Visualize e gerencie todos os comentários do sistema.</p>
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
                  placeholder="Buscar comentários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filters">
                <Link href="/admin" className="btn">← Voltar</Link>
                <button className="btn download" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
                  {showForm ? "Cancelar" : "+ Novo Comentário"}
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

        <div className="meta-row">
          <div style={{ display: "flex", gap: 16 }}>
            <span><strong>{filteredComments.length}</strong> comentários exibidos</span>
          </div>
        </div>

        {showForm && (
          <section className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>{editingId ? "Editar Comentário" : "Novo Comentário"}</h3>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Comentário *</label>
                <textarea 
                  value={form.comment} 
                  onChange={(e) => setForm({ ...form, comment: e.target.value })} 
                  rows={4} 
                  style={{ width: "100%", padding: 12, border: "1px solid var(--border-color)", borderRadius: 8, background: "var(--card)", color: "var(--foreground)", resize: "vertical" }} 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginTop: 16 }}>
                <label>Próximo Comentário (ID - opcional)</label>
                <input 
                  type="number" 
                  value={form.nextCommentId} 
                  onChange={(e) => setForm({ ...form, nextCommentId: e.target.value })} 
                  placeholder="ID do próximo comentário na cadeia"
                />
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 16 }}>
                <button type="button" className="btn" onClick={resetForm}>Cancelar</button>
                <button type="submit" className="btn-login">{editingId ? "Atualizar" : "Criar Comentário"}</button>
              </div>
            </form>
          </section>
        )}

        <div className="grid">
          {loading ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Carregando...</div>
          ) : filteredComments.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Nenhum comentário encontrado.</div>
          ) : (
            filteredComments.map((comment) => (
              <article className="card" key={comment.id}>
                <div className="top">
                  <span className="tag">ID: {comment.id}</span>
                </div>
                <p style={{ marginBottom: 12, whiteSpace: "pre-wrap", fontSize: 14 }}>{comment.comment}</p>
                <div className="tags">
                  <span className="tag">👤 {comment.userName}</span>
                  <span className="tag">{formatDate(comment.createdAt)}</span>
                  {comment.nextCommentId && <span className="tag">🔗 Próximo: {comment.nextCommentId}</span>}
                </div>
                <div className="actions">
                  <div className="buttons">
                    <button className="btn" onClick={() => handleEdit(comment)}>
                      <i className="fas fa-edit" /> Editar
                    </button>
                    <button className="btn" onClick={() => handleDelete(comment.id)} style={{ background: "#dc2626", color: "#fff" }}>
                      <i className="fas fa-trash" /> Excluir
                    </button>
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
