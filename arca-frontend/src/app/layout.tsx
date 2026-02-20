import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./exemplos/exemplos.css";
import NavHeader from "./NavHeader";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PermissionsProvider } from "./context/PermissionsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Removido Geist Mono temporariamente

export const metadata: Metadata = {
  title: "ARCA - Repositório Digital Multissetorial",
  description: "Sistema integrado para gestão de documentos educacionais, artigos pedagógicos e conteúdo audiovisual das instituições de ensino.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${geistSans.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <PermissionsProvider>
              <NavHeader />
              {children}
            </PermissionsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

