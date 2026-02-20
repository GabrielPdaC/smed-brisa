"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PermissionsContextType {
  apiPermissions: string[];
  clientPermissions: string[];
  hasClientPermission: (url: string) => boolean;
  loading: boolean;
  refreshPermissions: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType>({
  apiPermissions: [],
  clientPermissions: [],
  hasClientPermission: () => false,
  loading: true,
  refreshPermissions: async () => {},
});

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [apiPermissions, setApiPermissions] = useState<string[]>([]);
  const [clientPermissions, setClientPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/permissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApiPermissions(data.apiPermissions || []);
        setClientPermissions(data.clientPermissions || []);
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasClientPermission = (url: string): boolean => {
    // Verifica se tem permissão exata
    if (clientPermissions.includes(url)) {
      return true;
    }

    // Verifica padrões com wildcard
    for (const permission of clientPermissions) {
      if (matchesPermission(permission, url)) {
        return true;
      }
    }

    return false;
  };

  const matchesPermission = (pattern: string, url: string): boolean => {
    // Correspondência exata
    if (pattern === url) {
      return true;
    }

    // Padrão com wildcard no final (ex: /root/**)
    if (pattern.endsWith('/**')) {
      const basePattern = pattern.substring(0, pattern.length - 3);
      return url.startsWith(basePattern);
    }

    // Padrão com wildcard (ex: /root/*/edit)
    if (pattern.includes('*')) {
      const regexPattern = pattern
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*');
      return new RegExp(`^${regexPattern}$`).test(url);
    }

    return false;
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <PermissionsContext.Provider
      value={{
        apiPermissions,
        clientPermissions,
        hasClientPermission,
        loading,
        refreshPermissions: fetchPermissions,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionsContext);
}
