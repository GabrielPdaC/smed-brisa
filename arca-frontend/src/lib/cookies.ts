/**
 * Utilitário para gerenciar cookies no cliente e servidor
 */

export function setCookie(name: string, value: string, days: number = 1) {
  const maxAge = days * 24 * 60 * 60; // converte dias para segundos
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}
