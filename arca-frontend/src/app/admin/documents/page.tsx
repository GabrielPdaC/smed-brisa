"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { apiFetch, API_URL } from "@/lib/api";

export default function DocumentsPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    categoryId: "",
    schoolId: "",
    repositoryId: ""
  });
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [schools, setSchools] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSchool, setFilterSchool] = useState("");

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
    fetchSchools();
    fetchRepositories();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`${API_URL}/documents`);
      if (res.ok) setDocuments(await res.json());
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await apiFetch(`${API_URL}/categories`);
      if (res.ok) setCategories(await res.json());
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSchools = async () => {
    try {
      const res = await apiFetch(`${API_URL}/schools`);
      if (res.ok) setSchools(await res.json());
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const fetchRepositories = async () => {
    try {
      const res = await apiFetch(`${API_URL}/repositories?type=CEDOC`);
      if (res.ok) setRepositories(await res.json());
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      link: "",
      categoryId: "",
      schoolId: "",
      repositoryId: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setMessage('Erro: usuário não identificado. Faça login novamente.');
      setMessageType('error');
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      link: form.link,
      categoryId: Number(form.categoryId),
      schoolId: form.schoolId ? Number(form.schoolId) : null,
      repositoryId: Number(form.repositoryId),
      userId: Number(userId)
    };

    try {
      if (editingId) {
        const res = await apiFetch(`${API_URL}/documents/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setMessage("Documento atualizado com sucesso!");
          setMessageType("success");
          resetForm();
          fetchDocuments();
        } else {
          setMessage("Erro ao atualizar documento.");
          setMessageType("error");
        }
      } else {
        const res = await apiFetch(`${API_URL}/documents`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setMessage("Documento cadastrado com sucesso!");
          setMessageType("success");
          resetForm();
          fetchDocuments();
        } else {
          setMessage("Erro ao cadastrar documento.");
          setMessageType("error");
        }
      }
    } catch {
      setMessage("Erro na conexão com o servidor.");
      setMessageType("error");
    }
  };

  const handleEdit = (document: any) => {
    setForm({
      title: document.title || "",
      description: document.description || "",
      link: document.link || "",
      categoryId: document.categoryId?.toString() || "",
      schoolId: document.schoolId?.toString() || "",
      repositoryId: document.repositoryId?.toString() || ""
    });
    setEditingId(document.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este documento?")) return;
    try {
      const res = await apiFetch(`${API_URL}/documents/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("Documento excluído com sucesso!");
        setMessageType("success");
        fetchDocuments();
      } else {
        setMessage("Erro ao excluir documento.");
        setMessageType("error");
      }
    } catch {
      setMessage("Erro na conexão com o servidor.");
      setMessageType("error");
    }
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((d: any) => {
      const termo = searchTerm.toLowerCase();
      const matchSearch = d.title?.toLowerCase().includes(termo) ||
        d.description?.toLowerCase().includes(termo) ||
        d.categoryName?.toLowerCase().includes(termo) ||
        d.schoolName?.toLowerCase().includes(termo);
      const matchCategory = !filterCategory || d.categoryId?.toString() === filterCategory;
      const matchSchool = !filterSchool || d.schoolId?.toString() === filterSchool;
      return matchSearch && matchCategory && matchSchool;
    });
  }, [documents, searchTerm, filterCategory, filterSchool]);

  const getDocumentIcon = (link: string) => {
    const ext = link?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'fa-file-pdf';
      case 'doc':
      case 'docx': return 'fa-file-word';
      case 'xls':
      case 'xlsx': return 'fa-file-excel';
      case 'ppt':
      case 'pptx': return 'fa-file-powerpoint';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'fa-file-image';
      default: return 'fa-file-alt';
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <header className="header">
          <div className="logo-box"><i className="fas fa-file-alt" /></div>
          <div className="header-content">
            <h1>Gerenciar Documentos</h1>
            <p className="description">Cadastre, edite e gerencie os documentos do sistema.</p>
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
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filters">
                <select className="select modern" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="">Todas as categorias</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select className="select modern" value={filterSchool} onChange={(e) => setFilterSchool(e.target.value)}>
                  <option value="">Todas as escolas</option>
                  {schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <Link href="/admin" className="btn">← Voltar</Link>
                <button className="btn download" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
                  {showForm ? "Cancelar" : "+ Novo Documento"}
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
            <h3 style={{ marginBottom: 16 }}>{editingId ? "Editar Documento" : "Novo Documento"}</h3>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Título *</label>
                <input name="title" value={form.title} onChange={handleChange} required />
              </div>

              <div className="form-group" style={{ marginTop: 16 }}>
                <label>Link do Documento *</label>
                <input name="link" type="url" value={form.link} onChange={handleChange} placeholder="https://example.com/document.pdf" required />
              </div>

              <div className="form-group" style={{ marginTop: 16 }}>
                <label>Descrição</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ width: "100%", padding: 12, border: "1px solid var(--border-color)", borderRadius: 8, background: "var(--card)", color: "var(--foreground)", resize: "vertical" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                <div className="form-group">
                  <label>Categoria *</label>
                  <select name="categoryId" value={form.categoryId} onChange={handleChange} required className="select modern" style={{ width: "100%" }}>
                    <option value="">Selecione...</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Repositório *</label>
                  <select name="repositoryId" value={form.repositoryId} onChange={handleChange} required className="select modern" style={{ width: "100%" }}>
                    <option value="">Selecione...</option>
                    {repositories.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 16 }}>
                <label>Escola</label>
                <select name="schoolId" value={form.schoolId} onChange={handleChange} className="select modern" style={{ width: "100%" }}>
                  <option value="">Nenhuma (documento geral)</option>
                  {schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 16 }}>
                <button type="button" className="btn" onClick={resetForm}>Cancelar</button>
                <button type="submit" className="btn-login">{editingId ? "Atualizar" : "Cadastrar"}</button>
              </div>
            </form>
          </section>
        )}

        <div className="meta-row">
          <div>{loading ? "Carregando..." : `${filteredDocuments.length} documento(s) encontrado(s)`}</div>
        </div>

        <div className="grid">
          {loading ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Carregando...</div>
          ) : filteredDocuments.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Nenhum documento encontrado.</div>
          ) : (
            filteredDocuments.map((d: any) => (
              <article className="card" key={d.id}>
                <div style={{ 
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                  padding: 24, 
                  borderRadius: 8, 
                  marginBottom: 12, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  minHeight: 100
                }}>
                  <i className={`fas ${getDocumentIcon(d.link)}`} style={{ fontSize: 48, color: "#fff" }} />
                </div>
                <div className="top">
                  <div className="pill approved">{d.categoryName}</div>
                </div>
                <h3>{d.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 8 }}>
                  {d.description?.substring(0, 100)}{d.description?.length > 100 ? "..." : ""}
                </p>
                <div className="tags">
                  {d.schoolName && <span className="tag">{d.schoolName}</span>}
                  {d.userName && <span className="tag">Por: {d.userName}</span>}
                  {d.repositoryName && <span className="tag">{d.repositoryName}</span>}
                  {d.createdAt && <span className="tag">{new Date(d.createdAt).toLocaleDateString()}</span>}
                </div>
                <div className="actions">
                  <div className="buttons">
                    <a href={d.link} target="_blank" rel="noopener noreferrer" className="btn view"><i className="fas fa-download" /> Abrir</a>
                    <button className="btn" onClick={() => handleEdit(d)}><i className="fas fa-edit" /> Editar</button>
                    <button className="btn" onClick={() => handleDelete(d.id)} style={{ background: "#dc2626", color: "#fff" }}><i className="fas fa-trash" /> Excluir</button>
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
