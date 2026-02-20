"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { API_URL, apiFetch } from "@/lib/api";

interface DashboardStats {
  totalUsers: number;
  totalSchools: number;
  totalRoles: number;
  totalPermissions: number;
  totalVideos: number;
  totalJournals: number;
  totalArticles: number;
  totalComments: number;
  totalDocuments: number;
  totalRepositories: number;
  totalCategories: number;
}

interface AdminSection {
  title: string;
  description: string;
  href: string;
  icon: string;
  count: number;
  apiEndpoint: string;
}

function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSchools: 0,
    totalRoles: 0,
    totalPermissions: 0,
    totalVideos: 0,
    totalJournals: 0,
    totalArticles: 0,
    totalDocuments: 0,
    totalComments: 0,
    totalRepositories: 0,
    totalCategories: 0,
  });
  const [allowedSections, setAllowedSections] = useState<AdminSection[]>([]);
  const [loading, setLoading] = useState(true);

  const allSections: AdminSection[] = [
    {
      title: "Usuários",
      description: "Gerenciar usuários do sistema, definir roles e permissões de acesso",
      href: "/admin/users",
      icon: "fas fa-users",
      count: 0,
      apiEndpoint: "/users",
    },
    {
      title: "Escolas",
      description: "Administrar instituições de ensino e seus diretores",
      href: "/admin/schools",
      icon: "fas fa-school",
      count: 0,
      apiEndpoint: "/schools",
    },
    {
      title: "Revistas",
      description: "Gerenciar edições de revistas científicas",
      href: "/admin/journals",
      icon: "fas fa-book-open",
      count: 0,
      apiEndpoint: "/journals",
    },
    {
      title: "Artigos",
      description: "Moderar e aprovar artigos submetidos",
      href: "/admin/articles",
      icon: "fas fa-newspaper",
      count: 0,
      apiEndpoint: "/articles",
    },
    {
      title: "Comentários",
      description: "Visualizar e gerenciar comentários",
      href: "/admin/comments",
      icon: "fas fa-comments",
      count: 0,
      apiEndpoint: "/comments",
    },
    {
      title: "Vídeos",
      description: "Gerenciar conteúdo audiovisual e moderação",
      href: "/admin/videos",
      icon: "fas fa-video",
      count: 0,
      apiEndpoint: "/videos",
    },
    {
      title: "Documentos",
      description: "Gerenciar documentos e arquivos do sistema",
      href: "/admin/documents",
      icon: "fas fa-file-alt",
      count: 0,
      apiEndpoint: "/documents",
    },
    {
      title: "Repositórios",
      description: "Gerenciar repositórios de conteúdo",
      href: "/admin/repositories",
      icon: "fas fa-database",
      count: 0,
      apiEndpoint: "/repositories",
    },
    {
      title: "Categorias",
      description: "Gerenciar categorias de documentos e artigos",
      href: "/admin/categories",
      icon: "fas fa-tags",
      count: 0,
      apiEndpoint: "/categories",
    },
    {
      title: "Funções",
      description: "Controlar roles e perfis de acesso do sistema",
      href: "/admin/roles",
      icon: "fas fa-user-tag",
      count: 0,
      apiEndpoint: "/roles",
    },
    {
      title: "Permissões",
      description: "Configurar permissões granulares de acesso",
      href: "/admin/permissions",
      icon: "fas fa-key",
      count: 0,
      apiEndpoint: "/permissions",
    },
  ];

  useEffect(() => {
    checkPermissionsAndFetchStats();
  }, []);

  const checkPermissionsAndFetchStats = async () => {
    try {
      setLoading(true);
      const sectionsWithPermission: AdminSection[] = [];
      const statsData: Partial<DashboardStats> = {};

      // Testa cada seção para ver se tem permissão
      for (const section of allSections) {
        try {
          const res = await apiFetch(`${API_URL}${section.apiEndpoint}`);
          if (res.ok) {
            const data = await res.json();
            const count = Array.isArray(data) ? data.length : 0;
            
            // Atualiza o count da seção
            sectionsWithPermission.push({
              ...section,
              count
            });

            // Mapeamento de títulos para chaves do stats
            const titleToStatKey: Record<string, keyof DashboardStats> = {
              'Usuários': 'totalUsers',
              'Escolas': 'totalSchools',
              'Revistas': 'totalJournals',
              'Artigos': 'totalArticles',
              'Comentários': 'totalComments',
              'Vídeos': 'totalVideos',
              'Documentos': 'totalDocuments',
              'Repositórios': 'totalRepositories',
              'Categorias': 'totalCategories',
              'Funções': 'totalRoles',
              'Permissões': 'totalPermissions'
            };

            // Atualiza stats
            const statKey = titleToStatKey[section.title];
            if (statKey) {
              statsData[statKey] = count;
            }
          }
        } catch (error) {
          // Sem permissão para esta seção
          console.log(`Sem permissão para: ${section.title}`);
        }
      }

      setAllowedSections(sectionsWithPermission);
      setStats(statsData as DashboardStats);
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <header className="header">
          <div className="logo-box"><i className="fas fa-cogs" /></div>
          <div className="header-content">
            <h1>Painel de Administração</h1>
            <p className="description">Central de controle do sistema ARCA - Gerencie usuários, escolas, vídeos e configurações do sistema.</p>
          </div>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 18, color: 'var(--muted)' }}>Carregando permissões...</div>
          </div>
        ) : allowedSections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 18, color: 'var(--muted)' }}>Você não tem permissões administrativas.</div>
          </div>
        ) : (
          <>
            <div className="meta-row">
              <div style={{ display: 'flex', gap: 24, width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                {allowedSections.map((section) => (
                  <div key={section.title} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>
                      {section.count}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: 14 }}>{section.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid">
              {allowedSections.map((section) => (
                <Link href={section.href} key={section.title} style={{ textDecoration: 'none' }}>
                  <article className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    <div className="top">
                      <div style={{ fontSize: 24, color: 'var(--primary)' }}>
                        <i className={section.icon} />
                      </div>
                      <div className="pill pub">{section.count}</div>
                    </div>
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                    <div className="actions">
                      <div className="buttons">
                        <span className="btn view">Gerenciar <i className="fas fa-arrow-right" /></span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
