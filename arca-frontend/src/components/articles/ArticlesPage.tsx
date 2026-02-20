"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch, API_URL } from "@/lib/api";
import { usePermissions } from "@/app/context/PermissionsContext";
import CommentsModal from "@/components/CommentsModal";

interface ArticlesPageProps {
  showAdminControls?: boolean;
  showAddButton?: boolean;
  usePublicEndpoint?: boolean;
  preSelectedJournalId?: string;
}

interface Article {
  id: number;
  journalId: number;
  authors: string;
  title: string;
  url?: string;
  userId: number;
  userName: string;
  status: string;
  commentId?: number;
  createdAt: string;
}

interface Journal {
  id: number;
  repositoryName: string;
  status: string;
}

interface Comment {
  id: number;
  userId: number;
  userName: string;
  comment: string;
  nextCommentId?: number;
  createdAt: string;
}

export default function ArticlesPage({ showAdminControls = false, showAddButton = false, usePublicEndpoint = false, preSelectedJournalId }: ArticlesPageProps) {
  const { apiPermissions } = usePermissions();
  const [articles, setArticles] = useState<Article[]>([]);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Verificar se tem permissão para comentar
  const canComment = apiPermissions.some(perm => {
    const urlPattern = perm.trim();
    return urlPattern === '/api/comments/**' || urlPattern === '/api/**';
  });
  const [loading, setLoading] = useState(true);
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);
  const [articleComments, setArticleComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [form, setForm] = useState({
    journalId: preSelectedJournalId || "",
    authors: "",
    title: "",
    url: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchArticles();
    fetchJournals();
    fetchComments();
    
    // Abrir formulário automaticamente se houver journalId pré-selecionado
    if (preSelectedJournalId && showAddButton) {
      setShowForm(true);
    }
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const endpoint = usePublicEndpoint ? `${API_URL}/public/articles` : `${API_URL}/articles`;
      let res = usePublicEndpoint 
        ? await fetch(endpoint)
        : await apiFetch(endpoint);
      
      // Se receber 403, fazer fallback para endpoint público
      if (res.status === 403) {
        res = await fetch(`${API_URL}/public/articles`);
      }
      
      if (res.ok) setArticles(await res.json());
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
    setLoading(false);
  };

  const fetchJournals = async () => {
    try {
      let res = await apiFetch(`${API_URL}/journals`);
      
      // Se receber 403, fazer fallback para endpoint público
      if (res.status === 403) {
        res = await fetch(`${API_URL}/public/journals`);
      }
      
      if (res.ok) setJournals(await res.json());
    } catch (error) {
      console.error("Error fetching journals:", error);
    }
  };

  const fetchComments = async () => {
    try {
      let res = await apiFetch(`${API_URL}/comments`);
      
      // Se receber 403, fazer fallback para endpoint público
      if (res.status === 403) {
        res = await fetch(`${API_URL}/public/comments`);
      }
      
      if (res.ok) setComments(await res.json());
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const loadArticleComments = async (commentId: number) => {
    const chain: Comment[] = [];
    let currentId: number | undefined = commentId;
    
    while (currentId) {
      const comment = comments.find(c => c.id === currentId);
      if (comment) {
        chain.push(comment);
        currentId = comment.nextCommentId;
      } else {
        break;
      }
    }
    setArticleComments(chain);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const userId = localStorage.getItem("userId");

    const body = {
      journalId: parseInt(form.journalId),
      authors: form.authors,
      title: form.title,
      url: form.url,
      userId: parseInt(userId || "1"),
    };

    try {
      const url = editingId ? `${API_URL}/articles/${editingId}` : `${API_URL}/articles`;
      const res = await apiFetch(url, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMessage(editingId ? "Artigo atualizado!" : "Artigo criado!");
        setMessageType("success");
        resetForm();
        fetchArticles();
      } else {
        setMessage("Erro ao salvar artigo.");
        setMessageType("error");
      }
    } catch {
      setMessage("Erro de conexão.");
      setMessageType("error");
    }
  };

  const handleEdit = (article: Article) => {
    setForm({
      journalId: article.journalId.toString(),
      authors: article.authors,
      title: article.title,
      url: article.url || "",
    });
    setEditingId(article.id);
    setShowForm(true);
    setViewingArticle(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este artigo?")) return;
    try {
      const res = await apiFetch(`${API_URL}/articles/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Artigo excluído!");
        setMessageType("success");
        fetchArticles();
      } else {
        setMessage("Erro ao excluir.");
        setMessageType("error");
      }
    } catch {
      setMessage("Erro de conexão.");
      setMessageType("error");
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await apiFetch(`${API_URL}/articles/${id}/approve`, {
        method: "PUT"
      });
      if (res.ok) {
        setMessage("Artigo aprovado!");
        setMessageType("success");
        fetchArticles();
      } else {
        setMessage("Erro ao aprovar.");
        setMessageType("error");
      }
    } catch {
      setMessage("Erro de conexão.");
      setMessageType("error");
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Motivo da rejeição:");
    if (!reason) return;
    try {
      const res = await apiFetch(`${API_URL}/articles/${id}/reject`, {
        method: "PUT",
        body: JSON.stringify(reason)
      });
      if (res.ok) {
        setMessage("Artigo rejeitado.");
        setMessageType("success");
        fetchArticles();
      } else {
        setMessage("Erro ao rejeitar.");
        setMessageType("error");
      }
    } catch {
      setMessage("Erro de conexão.");
      setMessageType("error");
    }
  };

  const handleOpenComments = (article: Article) => {
    setSelectedArticle(article);
    setShowCommentsModal(true);
  };

  const handleCommentAdded = async (commentId: number) => {
    if (!selectedArticle) return;
    
    // Atualiza o artigo para incluir o primeiro comentário
    try {
      const res = await apiFetch(`${API_URL}/articles/${selectedArticle.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          journalId: selectedArticle.journalId,
          authors: selectedArticle.authors,
          title: selectedArticle.title,
          url: selectedArticle.url,
          commentId: commentId
        }),
      });
      if (res.ok) {
        fetchArticles();
      }
    } catch (error) {
      console.error('Erro ao atualizar artigo com comentário:', error);
    }
  };

  const handleAddComment = async (articleId: number) => {
    if (!newComment.trim()) return;
    const userId = localStorage.getItem("userId");
    
    try {
      const res = await apiFetch(`${API_URL}/comments`, {
        method: "POST",
        body: JSON.stringify({
          userId: parseInt(userId || "1"),
          comment: newComment,
        }),
      });
      
      if (res.ok) {
        const newCommentData = await res.json();
        
        const article = articles.find(a => a.id === articleId);
        if (article && article.commentId) {
          let lastComment = comments.find(c => c.id === article.commentId);
          while (lastComment?.nextCommentId) {
            lastComment = comments.find(c => c.id === lastComment!.nextCommentId);
          }
          
          if (lastComment) {
            await apiFetch(`${API_URL}/comments/${lastComment.id}`, {
              method: "PUT",
              body: JSON.stringify({ nextCommentId: newCommentData.id }),
            });
          }
        } else {
          await apiFetch(`${API_URL}/articles/${articleId}`, {
            method: "PUT",
            body: JSON.stringify({ commentId: newCommentData.id }),
          });
        }
        
        setNewComment("");
        setMessage("Comentário adicionado!");
        setMessageType("success");
        fetchArticles();
        fetchComments();
        if (viewingArticle) {
          loadArticleComments(newCommentData.id);
        }
      }
    } catch {
      setMessage("Erro ao adicionar comentário.");
      setMessageType("error");
    }
  };

  const resetForm = () => {
    setForm({ journalId: "", authors: "", title: "", url: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredArticles = articles.filter((a) => {
    const termo = searchTerm.toLowerCase();
    const matchSearch = a.title?.toLowerCase().includes(termo) ||
      a.userName?.toLowerCase().includes(termo) ||
      a.authors?.toLowerCase().includes(termo);
    const matchStatus = !filterStatus || a.status === filterStatus;
    const matchJournal = !preSelectedJournalId || a.journalId.toString() === preSelectedJournalId;
    return matchSearch && matchStatus && matchJournal;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "APPROVED": return "approved";
      case "REJECTED": return "rejected";
      default: return "pending";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED": return "Aprovado";
      case "REJECTED": return "Rejeitado";
      default: return "Pendente";
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("pt-BR");

  const pendingCount = articles.filter((a) => a.status === "PENDING").length;
  const approvedCount = articles.filter((a) => a.status === "APPROVED").length;

  const selectedJournal = preSelectedJournalId ? journals.find(j => j.id.toString() === preSelectedJournalId) : null;

  return (
    <div className="main-content">
      <div className="container">
        <header className="header">
          <div className="logo-box"><i className="fas fa-newspaper" /></div>
          <div className="header-content">
            <h1>{selectedJournal ? `Artigos - ${selectedJournal.repositoryName}` : "Artigos Científicos"}</h1>
            <p className="description">{showAdminControls ? "Aprove, edite e gerencie os artigos submetidos." : "Explore os artigos científicos publicados."}</p>
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
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filters">
                <select className="select modern" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">Todos os status</option>
                  <option value="PENDING">Pendentes</option>
                  <option value="APPROVED">Aprovados</option>
                  <option value="REJECTED">Rejeitados</option>
                </select>
                {showAdminControls && preSelectedJournalId && <Link href="/admin/journals" className="btn">← Voltar para Revistas</Link>}
                {showAdminControls && !preSelectedJournalId && <Link href="/admin" className="btn">← Voltar</Link>}
                {(showAdminControls || (showAddButton && isLoggedIn)) && (
                  <button className="btn download" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
                    {showForm ? "Cancelar" : "+ Novo Artigo"}
                  </button>
                )}
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
            <span><strong>{pendingCount}</strong> pendentes</span>
            <span><strong>{approvedCount}</strong> aprovados</span>
            <span><strong>{filteredArticles.length}</strong> exibidos</span>
          </div>
        </div>

        {showForm && (
          <section className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>{editingId ? "Editar Artigo" : "Novo Artigo"}</h3>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Título *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginTop: 16 }}>
                <label>Revista *</label>
                <select value={form.journalId} onChange={(e) => setForm({ ...form, journalId: e.target.value })} required className="select modern" style={{ width: "100%" }}>
                  <option value="">Selecione uma revista</option>
                  {journals.filter(j => j.status === "OPEN").map((j) => (
                    <option key={j.id} value={j.id}>{j.repositoryName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginTop: 16 }}>
                <label>Autores *</label>
                <textarea 
                  value={form.authors} 
                  onChange={(e) => setForm({ ...form, authors: e.target.value })} 
                  rows={2} 
                  style={{ width: "100%", padding: 12, border: "1px solid var(--border-color)", borderRadius: 8, background: "var(--card)", color: "var(--foreground)", resize: "vertical" }} 
                  required 
                  placeholder="Nome dos autores (separados por vírgula)"
                />
              </div>
              <div className="form-group" style={{ marginTop: 16 }}>
                <label>URL do Artigo</label>
                <input 
                  type="url"
                  value={form.url} 
                  onChange={(e) => setForm({ ...form, url: e.target.value })} 
                  placeholder="https://..."
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 16 }}>
                <button type="button" className="btn" onClick={resetForm}>Cancelar</button>
                <button type="submit" className="btn-login">{editingId ? "Atualizar" : "Criar Artigo"}</button>
              </div>
            </form>
          </section>
        )}

        <div className="grid">
          {loading ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Carregando...</div>
          ) : filteredArticles.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Nenhum artigo encontrado.</div>
          ) : (
            filteredArticles.map((article) => (
              <article className="card" key={article.id}>
                <div className="top">
                  <div className={`pill ${getStatusClass(article.status)}`}>{getStatusText(article.status)}</div>
                </div>
                <h3>{article.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 8 }}>
                  Por: {article.authors}
                </p>
                <div className="tags">
                  <span className="tag">👤 {article.userName}</span>
                  <span className="tag">{formatDate(article.createdAt)}</span>
                  {article.commentId && <span className="tag">💬 Com comentários</span>}
                </div>
                <div className="actions">
                  <div className="buttons" style={{ flexWrap: "wrap" }}>
                    <button className="btn view" onClick={() => {
                      setViewingArticle(article);
                      if (article.commentId) {
                        loadArticleComments(article.commentId);
                      } else {
                        setArticleComments([]);
                      }
                    }}><i className="fas fa-eye" /> Ver</button>
                    {canComment && (
                      <button 
                        className="btn" 
                        onClick={() => handleOpenComments(article)}
                        style={{ background: '#3b82f6', color: '#fff' }}
                      >
                        <i className="fas fa-comment" /> Comentários
                      </button>
                    )}
                    {showAdminControls && article.status === "PENDING" && (
                      <>
                        <button className="btn" onClick={() => handleApprove(article.id)} style={{ background: "#10b981", color: "#fff" }}><i className="fas fa-check" /> Aprovar</button>
                        <button className="btn" onClick={() => handleReject(article.id)} style={{ background: "#f59e0b", color: "#fff" }}><i className="fas fa-times" /> Rejeitar</button>
                      </>
                    )}
                    {showAdminControls && (
                      <>
                        <button className="btn" onClick={() => handleEdit(article)}><i className="fas fa-edit" /> Editar</button>
                        <button className="btn" onClick={() => handleDelete(article.id)} style={{ background: "#dc2626", color: "#fff" }}><i className="fas fa-trash" /> Excluir</button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {viewingArticle && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={() => setViewingArticle(null)}>
            <div className="card" style={{ maxWidth: 700, maxHeight: "80vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
              <h2>{viewingArticle.title}</h2>
              <div style={{ marginBottom: 12 }}>
                <span className={`pill ${getStatusClass(viewingArticle.status)}`}>{getStatusText(viewingArticle.status)}</span>
                <span style={{ marginLeft: 12, color: "var(--muted)" }}>por {viewingArticle.authors} • {formatDate(viewingArticle.createdAt)}</span>
              </div>
              <p style={{ marginBottom: 16, color: "var(--muted)" }}>Submetido por: {viewingArticle.userName}</p>
              
              {viewingArticle.url && (
                <div style={{ marginBottom: 16 }}>
                  <a href={viewingArticle.url} target="_blank" rel="noopener noreferrer" className="btn view">
                    <i className="fas fa-external-link-alt" /> Acessar Artigo
                  </a>
                </div>
              )}
              
              <div style={{ marginTop: 24, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                <h3 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <i className="fas fa-comments" />
                  Comentários ({articleComments.length})
                </h3>
                
                {articleComments.length > 0 ? (
                  <div style={{ marginBottom: 16, maxHeight: 300, overflowY: "auto" }}>
                    {articleComments.map((comment) => (
                      <div key={comment.id} style={{ 
                        background: "var(--background)", 
                        padding: 12, 
                        borderRadius: 8, 
                        marginBottom: 8,
                        border: "1px solid var(--border)"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <strong style={{ fontSize: 14 }}>{comment.userName}</strong>
                          <span style={{ fontSize: 12, color: "var(--muted)" }}>{formatDate(comment.createdAt)}</span>
                        </div>
                        <p style={{ fontSize: 14, whiteSpace: "pre-wrap" }}>{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 16 }}>Nenhum comentário ainda.</p>
                )}
                
                {isLoggedIn && (
                  <div style={{ marginTop: 12 }}>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Adicionar um comentário..."
                      rows={3}
                      style={{ 
                        width: "100%", 
                        padding: 12, 
                        border: "1px solid var(--border-color)", 
                        borderRadius: 8, 
                        background: "var(--card)", 
                        color: "var(--foreground)",
                        marginBottom: 8,
                        resize: "vertical"
                      }}
                    />
                    <button 
                      className="btn" 
                      onClick={() => handleAddComment(viewingArticle.id)}
                      style={{ background: "#10b981", color: "#fff" }}
                    >
                      <i className="fas fa-paper-plane" /> Adicionar Comentário
                    </button>
                  </div>
                )}
              </div>
              
              <div style={{ marginTop: 20, textAlign: "right" }}>
                <button className="btn" onClick={() => setViewingArticle(null)}>Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de Comentários */}
      {showCommentsModal && selectedArticle && (
        <CommentsModal
          entityType="article"
          entityId={selectedArticle.id}
          commentId={selectedArticle.commentId || null}
          onClose={() => {
            setShowCommentsModal(false);
            setSelectedArticle(null);
          }}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
}
