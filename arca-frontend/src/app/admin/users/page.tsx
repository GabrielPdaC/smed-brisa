"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch, API_URL } from "@/lib/api";

export default function UsersPage() {
  const [form, setForm] = useState({
    name: "",
    picture: "",
    password: "",
    contact: { phone: "", phone2: "", email: "" },
    address: { street: "", number: "", city: "", state: "", zip: "" },
    roleIds: [] as number[],
    schoolId: null as number | null,
  });
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [schools, setSchools] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchSchools();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await apiFetch(`${API_URL}/users`);
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    const res = await apiFetch(`${API_URL}/roles`);
    if (res.ok) {
      const data = await res.json();
      setRoles(data);
    }
  };

  const fetchSchools = async () => {
    const res = await apiFetch(`${API_URL}/users/schools`);
    if (res.ok) {
      const data = await res.json();
      setSchools(data);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("contact.")) {
      const key = name.split(".")[1];
      setForm({ ...form, contact: { ...form.contact, [key]: value } });
    } else if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm({ ...form, address: { ...form.address, [key]: value } });
    } else if (name === "schoolId") {
      setForm({ ...form, schoolId: value ? Number(value) : null });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      picture: "",
      password: "",
      contact: { phone: "", phone2: "", email: "" },
      address: { street: "", number: "", city: "", state: "", zip: "" },
      roleIds: [],
      schoolId: null,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    
    // Validar se pelo menos um role foi selecionado
    if (!form.roleIds || form.roleIds.length === 0) {
      setMessage("Selecione pelo menos um perfil (role) para o usuário.");
      setMessageType("error");
      return;
    }
    
    const payload = {
      name: form.name,
      picture: form.picture,
      contact: form.contact,
      address: form.address,
      password: form.password,
      roleIds: form.roleIds,
      schoolId: form.schoolId,
    };
    
    try {
      if (editingId) {
        const res = await apiFetch(`${API_URL}/users/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setMessage("Usuário atualizado com sucesso!");
          setMessageType("success");
          resetForm();
          fetchUsers();
        } else {
          setMessage("Erro ao atualizar usuário.");
          setMessageType("error");
        }
      } else {
        const res = await apiFetch(`${API_URL}/users`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setMessage("Usuário cadastrado com sucesso!");
          setMessageType("success");
          resetForm();
          fetchUsers();
        } else {
          setMessage("Erro ao cadastrar usuário.");
          setMessageType("error");
        }
      }
    } catch {
      setMessage("Erro na conexão com o servidor.");
      setMessageType("error");
    }
  };

  const handleEdit = (user: any) => {
    let roleIds = [];
    if (Array.isArray(user.roleIds)) {
      if (user.roleIds.length > 0 && typeof user.roleIds[0] === "object") {
        roleIds = user.roleIds.map((r: any) => r.id);
      } else {
        roleIds = user.roleIds;
      }
    } else if (Array.isArray(user.roles)) {
      roleIds = user.roles.map((r: any) => r.id);
    }
    setForm({
      name: user.name || "",
      picture: user.picture || "",
      password: "",
      contact: user.contact || { phone: "", phone2: "", email: "" },
      address: user.address || { street: "", number: "", city: "", state: "", zip: "" },
      roleIds,
      schoolId: user.school?.id || null,
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este usuário?")) return;
    const res = await apiFetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessage("Usuário excluído com sucesso!");
      setMessageType("success");
      fetchUsers();
    } else {
      setMessage("Erro ao excluir usuário.");
      setMessageType("error");
    }
  };

  const filteredUsers = users.filter((u: any) => {
    const termo = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(termo) ||
      u.contact?.email?.toLowerCase().includes(termo) ||
      u.school?.name?.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="main-content">
      <div className="container">
        <header className="header">
          <div className="logo-box"><i className="fas fa-users" /></div>
          <div className="header-content">
            <h1>Gerenciar Usuários</h1>
            <p className="description">Cadastre, edite e gerencie os usuários do sistema.</p>
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
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filters">
                <Link href="/admin" className="btn">← Voltar</Link>
                <button className="btn download" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
                  {showForm ? "Cancelar" : "+ Novo Usuário"}
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
            <h3 style={{ marginBottom: 16 }}>{editingId ? "Editar Usuário" : "Novo Usuário"}</h3>
            <form onSubmit={handleSubmit} className="login-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label>Nome</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Foto (URL)</label>
                  <input name="picture" value={form.picture} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Senha</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} required={!editingId} />
                </div>
                <div className="form-group">
                  <label>Escola</label>
                  <select name="schoolId" value={form.schoolId || ""} onChange={handleChange} className="select modern" style={{ width: "100%" }}>
                    <option value="">Selecione uma escola</option>
                    {schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
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
                  <input name="contact.email" type="email" value={form.contact.email} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
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

              <div className="form-group" style={{ marginTop: 16 }}>
                <label>Funções (Roles)</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {roles.map((role: any) => {
                    const checked = form.roleIds.includes(role.id);
                    return (
                      <label key={role.id} className={`tag ${checked ? "active" : ""}`} style={{ cursor: "pointer", padding: "8px 16px", background: checked ? "var(--primary)" : "var(--card-elevated)", color: checked ? "#fff" : "var(--foreground)" }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setForm({
                              ...form,
                              roleIds: checked
                                ? form.roleIds.filter((id) => id !== role.id)
                                : [...form.roleIds, role.id],
                            });
                          }}
                          style={{ display: "none" }}
                        />
                        {role.name}
                      </label>
                    );
                  })}
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
          <div>{loading ? "Carregando..." : `${filteredUsers.length} usuário(s) encontrado(s)`}</div>
        </div>

        <div className="grid">
          {loading ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Carregando...</div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>Nenhum usuário encontrado.</div>
          ) : (
            filteredUsers.map((u: any) => (
              <article className="card" key={u.id}>
                <div className="top">
                  <div className="pill pub">{u.roles?.map((r: any) => r.name).join(", ") || "Sem role"}</div>
                </div>
                <h3>{u.name}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14 }}>{u.contact?.email}</p>
                <div className="tags">
                  {u.school && <span className="tag">{u.school.name}</span>}
                  <span className="tag">ID: {u.id}</span>
                </div>
                <div className="actions">
                  <div className="buttons">
                    <button className="btn view" onClick={() => handleEdit(u)}><i className="fas fa-edit" /> Editar</button>
                    <button className="btn" onClick={() => handleDelete(u.id)} style={{ background: "#dc2626", color: "#fff" }}><i className="fas fa-trash" /> Excluir</button>
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
