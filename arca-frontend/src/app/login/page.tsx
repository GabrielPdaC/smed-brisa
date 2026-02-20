"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isAuthenticated, user, logout, isLoading } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      setSuccess("Login realizado com sucesso!");
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        phone,
      });
      setSuccess("Conta criada com sucesso!");
      setTimeout(() => {
        router.push("/root");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setSuccess("");
    setError("");
  };

  if (isLoading) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <p style={{ textAlign: "center" }}>Carregando...</p>
        </div>
      </div>
    );
  }

  // Se já está logado, mostra informações do usuário
  if (isAuthenticated && user) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user.picture ? (
                <img src={user.picture} alt={user.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <h2 className={styles.userName}>{user.name}</h2>
            <p className={styles.userEmail}>{user.email}</p>
            <div className={styles.userRoles}>
              {user.roles.map((role) => (
                <span key={role} className={styles.roleTag}>
                  {role}
                </span>
              ))}
            </div>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Sair da conta
            </button>
            <div className={styles.navButtons}>
              <Link href="/admin" className={styles.navButton}>
                Ir para Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>
          {isLoginMode ? "Login" : "Criar Conta"}
        </h1>
        <p className={styles.loginSubtitle}>
          {isLoginMode
            ? "Entre com suas credenciais"
            : "Preencha os dados para se registrar"}
        </p>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        {isLoginMode ? (
          // Formulário de Login
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        ) : (
          // Formulário de Registro
          <form onSubmit={handleRegister} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nome completo</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg-email">Email</label>
              <input
                type="email"
                id="reg-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Telefone</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg-password">Senha</label>
              <input
                type="password"
                id="reg-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
        )}

        <div className={styles.switchMode}>
          {isLoginMode ? (
            <>
              Não tem uma conta?
              <button onClick={() => { setIsLoginMode(false); setError(""); }}>
                Criar conta
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?
              <button onClick={() => { setIsLoginMode(true); setError(""); }}>
                Fazer login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
