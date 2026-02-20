"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function SchoolsPage() {
  const [form, setForm] = useState({
    name: "",
    contact: { phone: "", phone2: "", email: "" },
    address: { street: "", number: "", city: "", state: "", zip: "" },
    principal: {
      name: "",
      contact: { phone: "", phone2: "", email: "" },
      address: { street: "", number: "", city: "", state: "", zip: "" }
    }
  });
  const [schools, setSchools] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await fetch(`${API_URL}/api/schools`);
      if (res.ok) {
        const data = await res.json();
        setSchools(data);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("contact.")) {
      const key = name.split(".")[1];
      setForm({ ...form, contact: { ...form.contact, [key]: value } });
    } else if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm({ ...form, address: { ...form.address, [key]: value } });
    } else if (name.startsWith("principal.name")) {
      setForm({ ...form, principal: { ...form.principal, name: value } });
    } else if (name.startsWith("principal.contact.")) {
      const key = name.split(".")[2];
      setForm({ 
        ...form, 
        principal: { 
          ...form.principal, 
          contact: { ...form.principal.contact, [key]: value } 
        } 
      });
    } else if (name.startsWith("principal.address.")) {
      const key = name.split(".")[2];
      setForm({ 
        ...form, 
        principal: { 
          ...form.principal, 
          address: { ...form.principal.address, [key]: value } 
        } 
      });
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
        address: { street: "", number: "", city: "", state: "", zip: "" }
      }
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      name: form.name,
      contact: form.contact,
      address: form.address,
      principal: form.principal
    };

    try {
      let res;
      if (editingId) {
        // Editar escola
        res = await fetch(`${API_URL}/api/schools/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setMessage("Escola atualizada com sucesso!");
          resetForm();
          fetchSchools();
        } else {
          setMessage("Erro ao atualizar escola.");
        }
      } else {
        // Criar escola
        res = await fetch(`${API_URL}/api/schools`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setMessage("Escola cadastrada com sucesso!");
          resetForm();
          fetchSchools();
        } else {
          setMessage("Erro ao cadastrar escola.");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Erro na conexão com o servidor.");
    }
  };

  const handleEdit = (school: any) => {
    setForm({
      name: school.name || "",
      contact: school.contact || { phone: "", phone2: "", email: "" },
      address: school.address || { street: "", number: "", city: "", state: "", zip: "" },
      principal: school.principal || {
        name: "",
        contact: { phone: "", phone2: "", email: "" },
        address: { street: "", number: "", city: "", state: "", zip: "" }
      }
    });
    setEditingId(school.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta escola?")) return;
    
    try {
      const res = await fetch(`${API_URL}/api/schools/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Escola excluída com sucesso!");
        fetchSchools();
      } else {
        setMessage("Erro ao excluir escola.");
      }
    } catch (error) {
      console.error("Error deleting school:", error);
      setMessage("Erro na conexão com o servidor.");
    }
  };

  return (
    <main style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h1>Gerenciamento de Escolas</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>{editingId ? "Editar Escola" : "Nova Escola"}</h2>
        
        <div style={{ marginBottom: 16 }}>
          <input
            name="name"
            placeholder="Nome da Escola"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
        </div>

        <fieldset style={{ marginBottom: 16, padding: 12, border: "1px solid #ccc", borderRadius: 4 }}>
          <legend>Contato da Escola</legend>
          <input
            name="contact.phone"
            placeholder="Telefone"
            value={form.contact.phone}
            onChange={handleChange}
            required
            style={{ width: "30%", padding: 8, marginRight: 8 }}
          />
          <input
            name="contact.phone2"
            placeholder="Telefone 2"
            value={form.contact.phone2}
            onChange={handleChange}
            required
            style={{ width: "30%", padding: 8, marginRight: 8 }}
          />
          <input
            name="contact.email"
            placeholder="Email"
            type="email"
            value={form.contact.email}
            onChange={handleChange}
            required
            style={{ width: "35%", padding: 8 }}
          />
        </fieldset>

        <fieldset style={{ marginBottom: 16, padding: 12, border: "1px solid #ccc", borderRadius: 4 }}>
          <legend>Endereço da Escola</legend>
          <input
            name="address.street"
            placeholder="Endereço"
            value={form.address.street}
            onChange={handleChange}
            required
            style={{ width: "60%", padding: 8, marginRight: 8, marginBottom: 8 }}
          />
          <input
            name="address.number"
            placeholder="Número"
            value={form.address.number}
            onChange={handleChange}
            required
            style={{ width: "35%", padding: 8, marginBottom: 8 }}
          />
          <input
            name="address.city"
            placeholder="Cidade"
            value={form.address.city}
            onChange={handleChange}
            required
            style={{ width: "30%", padding: 8, marginRight: 8 }}
          />
          <input
            name="address.state"
            placeholder="Estado"
            value={form.address.state}
            onChange={handleChange}
            required
            style={{ width: "30%", padding: 8, marginRight: 8 }}
          />
          <input
            name="address.zip"
            placeholder="CEP"
            value={form.address.zip}
            onChange={handleChange}
            required
            style={{ width: "30%", padding: 8 }}
          />
        </fieldset>

        <fieldset style={{ marginBottom: 16, padding: 12, border: "1px solid #ccc", borderRadius: 4 }}>
          <legend>Dados do Diretor</legend>
          <input
            name="principal.name"
            placeholder="Nome do Diretor"
            value={form.principal.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          
          <div style={{ marginBottom: 8 }}>
            <input
              name="principal.contact.phone"
              placeholder="Telefone do Diretor"
              value={form.principal.contact.phone}
              onChange={handleChange}
              required
              style={{ width: "30%", padding: 8, marginRight: 8 }}
            />
            <input
              name="principal.contact.phone2"
              placeholder="Telefone 2"
              value={form.principal.contact.phone2}
              onChange={handleChange}
              required
              style={{ width: "30%", padding: 8, marginRight: 8 }}
            />
            <input
              name="principal.contact.email"
              placeholder="Email do Diretor"
              type="email"
              value={form.principal.contact.email}
              onChange={handleChange}
              required
              style={{ width: "35%", padding: 8 }}
            />
          </div>
          
          <div>
            <input
              name="principal.address.street"
              placeholder="Rua do Diretor"
              value={form.principal.address.street}
              onChange={handleChange}
              required
              style={{ width: "50%", padding: 8, marginRight: 8, marginBottom: 8 }}
            />
            <input
              name="principal.address.number"
              placeholder="Número"
              value={form.principal.address.number}
              onChange={handleChange}
              required
              style={{ width: "20%", padding: 8, marginRight: 8, marginBottom: 8 }}
            />
            <input
              name="principal.address.city"
              placeholder="Cidade"
              value={form.principal.address.city}
              onChange={handleChange}
              required
              style={{ width: "25%", padding: 8, marginBottom: 8 }}
            />
            <input
              name="principal.address.state"
              placeholder="Estado"
              value={form.principal.address.state}
              onChange={handleChange}
              required
              style={{ width: "25%", padding: 8, marginRight: 8 }}
            />
            <input
              name="principal.address.zip"
              placeholder="CEP"
              value={form.principal.address.zip}
              onChange={handleChange}
              required
              style={{ width: "25%", padding: 8 }}
            />
          </div>
        </fieldset>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: 4 }}>
            {editingId ? "Atualizar Escola" : "Cadastrar Escola"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: 4 }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {message && (
        <div style={{ padding: 12, marginBottom: 20, backgroundColor: message.includes("sucesso") ? "#d4edda" : "#f8d7da", border: `1px solid ${message.includes("sucesso") ? "#c3e6cb" : "#f5c6cb"}`, borderRadius: 4 }}>
          {message}
        </div>
      )}

      <div>
        <h2>Escolas Cadastradas</h2>
        {schools.length === 0 ? (
          <p>Nenhuma escola cadastrada.</p>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {schools.map((school: any) => (
              <div key={school.id} style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8, backgroundColor: "#f9f9f9" }}>
                <h3>{school.name}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
                  <div>
                    <h4>Contato:</h4>
                    <p>Telefone: {school.contact?.phone}</p>
                    <p>Telefone 2: {school.contact?.phone2}</p>
                    <p>Email: {school.contact?.email}</p>
                    
                    <h4>Endereço:</h4>
                    <p>{school.address?.street}, {school.address?.number}</p>
                    <p>{school.address?.city} - {school.address?.state}</p>
                    <p>CEP: {school.address?.zip}</p>
                  </div>
                  <div>
                    <h4>Diretor: {school.principal?.name}</h4>
                    <p>Telefone: {school.principal?.contact?.phone}</p>
                    <p>Email: {school.principal?.contact?.email}</p>
                    <p>Endereço: {school.principal?.address?.street}, {school.principal?.address?.number}</p>
                    <p>{school.principal?.address?.city} - {school.principal?.address?.state}</p>
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleEdit(school)}
                    style={{ padding: "6px 12px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: 4 }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(school.id)}
                    style={{ padding: "6px 12px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: 4 }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}