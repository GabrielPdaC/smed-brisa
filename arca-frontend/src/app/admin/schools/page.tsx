"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch, API_URL } from "@/lib/api";

export default function SchoolsPage() {
  const [form, setForm] = useState({
    name: "",
    contact: { phone: "", phone2: "", email: "" },
    address: { street: "", number: "", city: "", state: "", zip: "" },
    principal: {
      name: "",
      contact: { phone: "", phone2: "", email: "" },
      address: { street: "", number: "", city: "", state: "", zip: "" },
    },
  });
  const [schools, setSchools] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    const res = await apiFetch(`${API_URL}/schools`);
    if (res.ok) {
      const data = await res.json();
      setSchools(data);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("contact.")) {
      const key = name.split(".")[1];
      setForm({ ...form, contact: { ...form.contact, [key]: value } });
    } else if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm({ ...form, address: { ...form.address, [key]: value } });
    } else if (name.startsWith("principal.")) {
      const sub = name.split(".")[1];
      if (["phone", "phone2", "email"].includes(sub)) {
        setForm({
          ...form,
          principal: {
            ...form.principal,
            contact: { ...form.principal.contact, [sub]: value },
          },
        });
      } else if (["street", "number", "city", "state", "zip"].includes(sub)) {
        setForm({
          ...form,
          principal: {
            ...form.principal,
            address: { ...form.principal.address, [sub]: value },
          },
        });
      } else if (sub === "name") {
        setForm({
          ...form,
          principal: { ...form.principal, name: value },
        });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      contact: { phone: "", phone2: "", email: "" },
      address: { street: "", number: "", city: "", state: "", zip: "" },
      principal: {
        name: "",
        contact: { phone: "", phone2: "", email: "" },
        address: { street: "", number: "", city: "", state: "", zip: "" },
      },
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editingId) {
        const res = await apiFetch(`${API_URL}/schools/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setMessage("Escola atualizada com sucesso!");
          setMessageType("success");
          resetForm();
          fetchSchools();
        } else {
          setMessage("Erro ao atualizar escola.");
          setMessageType("error");
        }
      } else {
        const res = await apiFetch(`${API_URL}/schools`, {
          method: "POST",
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setMessage("Escola cadastrada com sucesso!");
          setMessageType("success");
          resetForm();
          fetchSchools();
        } else {
          setMessage("Erro ao cadastrar escola.");
          setMessageType("error");
        }
      }
    } catch {
      setMessage("Erro na conexão com o servidor.");
      setMessageType("error");
    }
  };

  const handleEdit = (school: any) => {
    setForm({
      name: school.name || "",
      contact: school.contact || { phone: "", phone2: "", email: "" },
      address: school.address || { street: "", number: "", city: "", state: "", zip: "" },
      principal: school.principal
        ? {
            name: school.principal.name || "",
            contact: school.principal.contact || { phone: "", phone2: "", email: "" },
            address: school.principal.address || { street: "", number: "", city: "", state: "", zip: "" },
          }
        : {
            name: "",
            contact: { phone: "", phone2: "", email: "" },
            address: { street: "", number: "", city: "", state: "", zip: "" },
          },
    });
    setEditingId(school.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta escola?")) return;
    const res = await fetch(`${API_URL}/schools/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessage("Escola excluída com sucesso!");
      setMessageType("success");
      fetchSchools();
    } else {
      setMessage("Erro ao excluir escola.");
      setMessageType("error");
    }
  };

  const filteredSchools = schools.filter((s: any) => {
    const termo = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(termo) ||
      s.address?.city?.toLowerCase().includes(termo) ||
      s.principal?.name?.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="main-content">
      <div className="container">
        <header className="header">
          <div className="logo-box"><i className="fas fa-school" /></div>
          <div className="header-content">
            <h1>Gerenciar Escolas</h1>
            <p className="description">Cadastre, edite e gerencie as escolas do sistema.</p>
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
                  placeholder="Buscar escolas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filters">
                <Link href="/admin" className="btn">← Voltar</Link>
                <button className="btn download" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
                  {showForm ? "Cancelar" : "+ Nova Escola"}
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
            <h3 style={{ marginBottom: 16 }}>{editingId ? "Editar Escola" : "Nova Escola"}</h3>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Nome da Escola</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>

              <h4 style={{ marginTop: 20, marginBottom: 12, color: "var(--muted)" }}>Contato da Escola</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label>Telefone</label>
                  <input name="contact.phone" value={form.contact.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Telefone 2</label>
                  <input name="contact.phone2" value={form.contact.phone2} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="contact.email" type="email" value={form.contact.email} onChange={handleChange} />
                </div>
              </div>

              <h4 style={{ marginTop: 20, marginBottom: 12, color: "var(--muted)" }}>Endereço da Escola</h4>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label>Endereço</label>
                  <input name="address.street" value={form.address.street} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Número</label>
                  <input name="address.number" value={form.address.number} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Cidade</label>
                  <input name="address.city" value={form.address.city} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <input name="address.state" value={form.address.state} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>CEP</label>
                  <input name="address.zip" value={form.address.zip} onChange={handleChange} />
                </div>
              </div>

              <h4 style={{ marginTop: 20, marginBottom: 12, color: "var(--muted)" }}>Diretor(a)</h4>
              <div className="form-group">
                <label>Nome do Diretor</label>
                <input name="principal.name" value={form.principal.name} onChange={handleChange} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label>Telefone</label>
                  <input name="principal.phone" value={form.principal.contact.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Telefone 2</label>
                  <input name="principal.phone2" value={form.principal.contact.phone2} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="principal.email" type="email" value={form.principal.contact.email} onChange={handleChange} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label>Endereço</label>
                  <input name="principal.street" value={form.principal.address.street} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Número</label>
                  <input name="principal.number" value={form.principal.address.number} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Cidade</label>
                  <input name="principal.city" value={form.principal.address.city} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <input name="principal.state" value={form.principal.address.state} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>CEP</label>
                  <input name="principal.zip" value={form.principal.address.zip} onChange={handleChange} />
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
          <div>{loading ? "Carregando..." : `${filteredSchools.length} escola(s) encontrada(s)`}</div>
        </div>

        <div className="grid">
          {loading ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Carregando...</div>
          ) : filteredSchools.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Nenhuma escola encontrada.</div>
          ) : (
            filteredSchools.map((s: any) => (
              <article className="card" key={s.id}>
                <div className="top">
                  <div className="pill pub">ID: {s.id}</div>
                </div>
                <h3>{s.name}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14 }}>
                  {s.address ? `${s.address.street}, ${s.address.number} - ${s.address.city}/${s.address.state}` : "Sem endereço"}
                </p>
                <div className="tags">
                  {s.principal && <span className="tag">Dir.: {s.principal.name}</span>}
                  {s.contact?.email && <span className="tag">{s.contact.email}</span>}
                </div>
                <div className="actions">
                  <div className="buttons">
                    <button className="btn view" onClick={() => handleEdit(s)}><i className="fas fa-edit" /> Editar</button>
                    <button className="btn" onClick={() => handleDelete(s.id)} style={{ background: "#dc2626", color: "#fff" }}><i className="fas fa-trash" /> Excluir</button>
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
