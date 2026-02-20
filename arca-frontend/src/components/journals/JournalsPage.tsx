"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch, API_URL } from "@/lib/api";

interface Journal {
  id: number;
  name?: string;
  repositoryId: number;
  repositoryName: string;
  schoolId: number;
  schoolName: string;
  userId: number;
  userName: string;
  openingDate: string;
  closingDate?: string;
  status: string;
}

interface Repository {
  id: number;
  name: string;
}

interface School {
  id: number;
  name: string;
}

interface JournalsPageProps {
  showAdminControls?: boolean;
  showAddButton?: boolean;
  usePublicEndpoint?: boolean;
  startWithFormOpen?: boolean;
}

export default function JournalsPage({ 
  showAdminControls = true, 
  showAddButton = false,
  usePublicEndpoint = false,
  startWithFormOpen = false
}: JournalsPageProps) {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [form, setForm] = useState({
    name: "",
    repositoryId: "",
    schoolId: "",
    status: "OPEN",
    closingDate: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchJournals();
    if (showAddButton || showAdminControls) {
      fetchRepositories();
      fetchSchools();
    }
    // Abrir formulário automaticamente se startWithFormOpen for true
    if (startWithFormOpen) {
      setShowForm(true);
    }
  }, [showAddButton, showAdminControls, startWithFormOpen]);

  const fetchJournals = async () => {
    setLoading(true);
    try {
      const endpoint = usePublicEndpoint ? `${API_URL}/public/journals` : `${API_URL}/journals`;
      let res = usePublicEndpoint 
        ? await fetch(endpoint)
        : await apiFetch(endpoint);
      
      // Se receber 403, fazer fallback para endpoint público
      if (res.status === 403) {
        res = await fetch(`${API_URL}/public/journals`);
      }
      
      if (res.ok) setJournals(await res.json());
    } catch (error) {
      console.error("Error fetching journals:", error);
    }
    setLoading(false);
  };

  const fetchRepositories = async () => {
    try {
      let res = await apiFetch(`${API_URL}/repositories?type=PEDAGOGICO`);
      
      // Se receber 403, tentar sem autenticação
      if (res.status === 403) {
        res = await fetch(`${API_URL}/repositories?type=PEDAGOGICO`);
      }
      
      if (res.ok) setRepositories(await res.json());
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };

  const fetchSchools = async () => {
    try {
      let res = await apiFetch(`${API_URL}/schools`);
      
      // Se receber 403, tentar sem autenticação
      if (res.status === 403) {
        res = await fetch(`${API_URL}/schools`);
      }
      
      if (res.ok) setSchools(await res.json());
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const userId = localStorage.getItem("userId");

    const body = {
      name: form.name,
      repositoryId: parseInt(form.repositoryId),
      schoolId: parseInt(form.schoolId),
      userId: parseInt(userId || "1"),
      status: form.status,
      ...(form.closingDate && { closingDate: new Date(form.closingDate).toISOString() }),
    };

    try {
      const url = editingId ? `${API_URL}/journals/${editingId}` : `${API_URL}/journals`;
      const res = await apiFetch(url, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMessage(editingId ? "Revista atualizada!" : "Revista criada!");
        setMessageType("success");
        resetForm();
        fetchJournals();
      } else {
        setMessage("Erro ao salvar revista.");
        setMessageType("error");
      }
    } catch {
      setMessage("Erro de conexão.");
      setMessageType("error");
    }
  };

  const handleEdit = (journal: Journal) => {
    setForm({
      name: journal.name || "",
      repositoryId: journal.repositoryId.toString(),
      schoolId: journal.schoolId.toString(),
      status: journal.status,
      closingDate: journal.closingDate ? new Date(journal.closingDate).toISOString().split('T')[0] : "",
    });
    setEditingId(journal.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir esta revista?")) return;
    try {
      const res = await apiFetch(`${API_URL}/journals/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Revista excluída!");
        setMessageType("success");
        fetchJournals();
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
    setForm({ name: "", repositoryId: "", schoolId: "", status: "OPEN", closingDate: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredJournals = journals.filter((j) => {
    const termo = searchTerm.toLowerCase();
    const matchSearch = j.repositoryName?.toLowerCase().includes(termo) || 
                       j.schoolName?.toLowerCase().includes(termo) ||
                       j.userName?.toLowerCase().includes(termo);
    const matchStatus = !filterStatus || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "OPEN": return "approved";
      case "CLOSED": return "rejected";
      default: return "pending";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "OPEN": return "Aberta";
      case "CLOSED": return "Fechada";
      default: return "Agendada";
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("pt-BR");

  const openCount = journals.filter((j) => j.status === "OPEN").length;
  const closedCount = journals.filter((j) => j.status === "CLOSED").length;

  return (
    <div className="main-content">
      <div className="container">
        <header className="header">
          <div className="logo-box"><i className="fas fa-book-open" /></div>
          <div className="header-content">
            <h1>{showAdminControls ? "Gerenciar Revistas" : "Revistas Pedagógicas"}</h1>
            <p className="description">
              {showAdminControls 
                ? "Crie e gerencie as edições da revista científica." 
                : "Explore as edições da revista científica."}
            </p>
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
                  placeholder="Buscar revistas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filters">
                <select className="select modern" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">Todos os status</option>
                  <option value="OPEN">Abertas</option>
                  <option value="CLOSED">Fechadas</option>
                </select>
                {showAdminControls && <Link href="/admin" className="btn">← Voltar</Link>}
                {(showAddButton && isLoggedIn || showAdminControls) && (
                  <button className="btn download" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
                    {showForm ? "Cancelar" : "+ Nova Revista"}
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
            <span><strong>{openCount}</strong> abertas</span>
            <span><strong>{closedCount}</strong> fechadas</span>
            <span><strong>{filteredJournals.length}</strong> exibidas</span>
          </div>
        </div>

        {showForm && (
          <section className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>{editingId ? "Editar Revista" : "Nova Revista"}</h3>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Nome *</label>
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  required 
                  placeholder="Nome da revista"
                />
              </div>
              <div className="form-group" style={{ marginTop: 16 }}>
                <label>Repositório *</label>
                <select value={form.repositoryId} onChange={(e) => setForm({ ...form, repositoryId: e.target.value })} required className="select modern" style={{ width: "100%" }}>
                  <option value="">Selecione um repositório</option>
                  {repositories.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginTop: 16 }}>
                <label>Escola *</label>
                <select value={form.schoolId} onChange={(e) => setForm({ ...form, schoolId: e.target.value })} required className="select modern" style={{ width: "100%" }}>
                  <option value="">Selecione uma escola</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                <div className="form-group">
                  <label>Status *</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} required className="select modern" style={{ width: "100%" }}>
                    <option value="OPEN">Aberta</option>
                    <option value="CLOSED">Fechada</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Data de Encerramento</label>
                  <input type="date" value={form.closingDate} onChange={(e) => setForm({ ...form, closingDate: e.target.value })} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 16 }}>
                <button type="button" className="btn" onClick={resetForm}>Cancelar</button>
                <button type="submit" className="btn-login">{editingId ? "Atualizar" : "Criar Revista"}</button>
              </div>
            </form>
          </section>
        )}

        <div className="grid">
          {loading ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Carregando...</div>
          ) : filteredJournals.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Nenhuma revista encontrada.</div>
          ) : (
            filteredJournals.map((journal) => (
              <article className="card" key={journal.id}>
                <div className="top">
                  <div className={`pill ${getStatusClass(journal.status)}`}>{getStatusText(journal.status)}</div>
                </div>
                <h3>{journal.name || journal.repositoryName}</h3>
                {journal.name && (
                  <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6, marginBottom: 8 }}>
                    Repositório: {journal.repositoryName}
                  </p>
                )}
                <div className="tags">
                  <span className="tag">🏫 {journal.schoolName}</span>
                  <span className="tag">👤 {journal.userName}</span>
                  <span className="tag">📅 Aberta: {formatDate(journal.openingDate)}</span>
                  {journal.closingDate && <span className="tag">🔒 Fechada: {formatDate(journal.closingDate)}</span>}
                </div>
                <div className="actions">
                  <div className="buttons">
                    <Link 
                      href={showAdminControls ? `/admin/journals/${journal.id}/articles` : `/pedagogico/revistas/${journal.id}`} 
                      className="btn view"
                    >
                      <i className="fas fa-newspaper" /> Ver Artigos
                    </Link>
                    {showAdminControls && (
                      <>
                        <button className="btn" onClick={() => handleEdit(journal)}>
                          <i className="fas fa-edit" /> Editar
                        </button>
                        <button className="btn" onClick={() => handleDelete(journal.id)} style={{ background: "#dc2626", color: "#fff" }}>
                          <i className="fas fa-trash" /> Excluir
                        </button>
                      </>
                    )}
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
