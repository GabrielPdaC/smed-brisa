"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setCookie, deleteCookie } from "@/lib/cookies";

interface User {
  id: number;
  name: string;
  email: string;
  picture: string;
  roles: string[];
  schoolId?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  phone2?: string;
  picture?: string;
  street?: string;
  city?: string;
  state?: string;
  number?: string;
  zip?: string;
  schoolId?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carrega dados do localStorage ao iniciar
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Garantir que userId e schoolId estão salvos separadamente
      if (!localStorage.getItem("userId") && userData.id) {
        localStorage.setItem("userId", userData.id.toString());
      }
      if (!localStorage.getItem("schoolId") && userData.schoolId) {
        localStorage.setItem("schoolId", userData.schoolId.toString());
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Credenciais inválidas");
    }

    const data = await response.json();

    const userData: User = {
      id: data.id,
      name: data.name,
      email: data.email,
      picture: data.picture,
      roles: data.roles,
      schoolId: data.schoolId,
    };

    setToken(data.token);
    setUser(userData);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userId", data.id.toString());
    if (data.schoolId) {
      localStorage.setItem("schoolId", data.schoolId.toString());
    }
    
    // Salva token em cookie para o middleware acessar
    setCookie("token", data.token, 1);
  };

  const register = async (data: RegisterData) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao registrar");
    }

    const responseData = await response.json();

    const userData: User = {
      id: responseData.id,
      name: responseData.name,
      email: responseData.email,
      picture: responseData.picture,
      roles: responseData.roles,
      schoolId: responseData.schoolId,
    };

    setToken(responseData.token);
    setUser(userData);
    localStorage.setItem("token", responseData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userId", responseData.id.toString());
    if (responseData.schoolId) {
      localStorage.setItem("schoolId", responseData.schoolId.toString());
    }
    
    // Salva token em cookie para o middleware acessar
    setCookie("token", responseData.token, 1);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("schoolId");
    
    // Remove o cookie
    deleteCookie("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper para fazer requisições autenticadas
export function useAuthFetch() {
  const { token } = useAuth();

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return response;
  };

  return authFetch;
}
