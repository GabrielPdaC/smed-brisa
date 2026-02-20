'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch, API_URL } from '@/lib/api';
import { usePermissions } from '@/app/context/PermissionsContext';
import CommentsModal from '@/components/CommentsModal';

interface Journal {
  id: number;
  repositoryId: number;
  repositoryName: string;
  schoolId: number;
  schoolName: string;
  userId: number;
  userName: string;
  openingDate: string;
  closingDate?: string;
  status: string;
}

interface Article {
  id: number;
  journalId: number;
  authors: string;
  title: string;
  url?: string;
  userId: number;
  userName: string;
  status: string;
  commentId?: number;
  createdAt: string;
}

export default function ArticleDetailsPage() {
  const { apiPermissions } = usePermissions();
  const params = useParams();
  const journalId = params.id as string;
  const articleId = params.articleId as string;
  
  const [journal, setJournal] = useState<Journal | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [canModerate, setCanModerate] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  
  // Verificar se tem permissão para comentar
  const canComment = apiPermissions.some(perm => {
    const urlPattern = perm.trim();
    return urlPattern === '/api/comments/**' || urlPattern === '/api/**';
  });

  useEffect(() => {
    fetchArticleData();
  }, [articleId, journalId]);

  const fetchArticleData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Tentar com autenticação, se falhar com 403, usar endpoint público
      let journalRes = token ? await apiFetch(`${API_URL}/journals/${journalId}`) : await fetch(`${API_URL}/public/journals/${journalId}`);
      if (journalRes.status === 403) {
        journalRes = await fetch(`${API_URL}/public/journals/${journalId}`);
      }

      let articleRes = token ? await apiFetch(`${API_URL}/articles/${articleId}`) : await fetch(`${API_URL}/public/articles/${articleId}`);
      if (articleRes.status === 403) {
        articleRes = await fetch(`${API_URL}/public/articles/${articleId}`);
        setCanModerate(false);
      } else if (articleRes.ok && token) {
        // Se conseguiu acessar o artigo autenticado, assume que tem permissão de moderação
        // O backend bloqueará a ação real se não tiver permissão
        setCanModerate(true);
      }

      if (journalRes.ok) {
        setJournal(await journalRes.json());
      }

      if (articleRes.ok) {
        setArticle(await articleRes.json());
      }
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await apiFetch(`${API_URL}/articles/${articleId}/approve`, {
        method: 'PUT'
      });
      
      if (res.ok) {
        setMessage('Artigo aprovado!');
        setMessageType('success');
        fetchArticleData();
      } else {
        setMessage('Erro ao aprovar artigo.');
        setMessageType('error');
      }
    } catch {
      setMessage('Erro de conexão.');
      setMessageType('error');
    }
  };

  const handleReject = async () => {
    const reason = prompt('Motivo da rejeição:');
    if (!reason) return;
    
    try {
      const res = await apiFetch(`${API_URL}/articles/${articleId}/reject`, {
        method: 'PUT',
        body: JSON.stringify(reason)
      });
      
      if (res.ok) {
        setMessage('Artigo rejeitado.');
        setMessageType('success');
        fetchArticleData();
      } else {
        setMessage('Erro ao rejeitar artigo.');
        setMessageType('error');
      }
    } catch {
      setMessage('Erro de conexão.');
      setMessageType('error');
    }
  };

  const handleCommentAdded = async (commentId: number) => {
    if (!article) return;
    
    // Atualiza o artigo para incluir o primeiro comentário
    try {
      const res = await apiFetch(`${API_URL}/articles/${articleId}`, {
        method: 'PUT',
        body: JSON.stringify({
          authors: article.authors,
          title: article.title,
          url: article.url,
          commentId: commentId
        }),
      });
      if (res.ok) {
        fetchArticleData();
      }
    } catch (error) {
      console.error('Erro ao atualizar artigo com comentário:', error);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '40px' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="main-content">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '40px' }}>Artigo não encontrado.</p>
          <div style={{ textAlign: 'center' }}>
            <Link href={`/pedagogico/revistas/${journalId}`} className="btn view">Voltar para a Revista</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        {message && (
          <div style={{ 
            padding: '12px 16px', 
            marginBottom: '16px', 
            borderRadius: '4px',
            background: messageType === 'success' ? '#d1fae5' : '#fee2e2',
            color: messageType === 'success' ? '#065f46' : '#991b1b',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
        
        <header className="header">
          <div className="logo-box"><i className="fas fa-file-alt" /></div>
          <div className="header-content" style={{ maxWidth: 800 }}>
            <div style={{ marginBottom: 8 }}>
              <Link href={`/pedagogico/revistas/${journalId}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: 14 }}>
                ← {journal?.repositoryName || `Revista #${journalId}`}
              </Link>
            </div>
            <h1>{article.title}</h1>
            <p className="description">
              {article.authors}
            </p>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>
              Publicado por {article.userName} • {new Date(article.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </header>

        <div className="meta-row" style={{ marginTop: 24 }}>
          <div>
            <span className={`pill ${article.status === 'APPROVED' ? 'pub' : article.status === 'PENDING' ? 'draft' : 'closed'}`}>
              {article.status === 'APPROVED' ? 'Aprovado' : article.status === 'PENDING' ? 'Pendente' : 'Rejeitado'}
            </span>
            <span className="pill" style={{ marginLeft: 8, background: '#f0f0f0', color: '#666' }}>
              Revista #{article.journalId}
            </span>
          </div>
          <div className="buttons">
            {canComment && (
              <button 
                onClick={() => setShowCommentsModal(true)}
                className="btn" 
                style={{ background: '#3b82f6', color: '#fff', marginRight: 8 }}
              >
                <i className="fas fa-comment" /> Comentários
              </button>
            )}
            {canModerate && article.status === 'PENDING' && (
              <>
                <button onClick={handleApprove} className="btn" style={{ background: '#10b981', color: '#fff', marginRight: 8 }}>
                  <i className="fas fa-check" /> Aprovar
                </button>
                <button onClick={handleReject} className="btn" style={{ background: '#f59e0b', color: '#fff', marginRight: 8 }}>
                  <i className="fas fa-times" /> Rejeitar
                </button>
              </>
            )}
            <Link href={`/pedagogico/revistas/${journalId}`} className="btn view">
              Ver outros artigos da revista
            </Link>
            <Link href="/pedagogico" className="btn download" style={{ marginLeft: 8 }}>
              Voltar para Pedagógico
            </Link>
          </div>
        </div>

        <section style={{ marginTop: 32 }}>
          <article className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ padding: '24px' }}>
              <h2 style={{ fontSize: 24, marginBottom: 16, color: 'var(--text)' }}>Informações do Artigo</h2>
              
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, marginBottom: 8, color: 'var(--muted)' }}>Título</h3>
                <p style={{ fontSize: 18, color: 'var(--text)' }}>{article.title}</p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, marginBottom: 8, color: 'var(--muted)' }}>Autores</h3>
                <p style={{ fontSize: 16, color: 'var(--text)' }}>{article.authors}</p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, marginBottom: 8, color: 'var(--muted)' }}>Submetido por</h3>
                <p style={{ fontSize: 16, color: 'var(--text)' }}>{article.userName}</p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, marginBottom: 8, color: 'var(--muted)' }}>Data de Publicação</h3>
                <p style={{ fontSize: 16, color: 'var(--text)' }}>
                  {new Date(article.createdAt).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>

              {article.url && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, marginBottom: 8, color: 'var(--muted)' }}>Link do Artigo</h3>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn download"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  >
                    <i className="fas fa-external-link-alt" /> Acessar Artigo Completo
                  </a>
                </div>
              )}

              {journal && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, marginBottom: 8, color: 'var(--muted)' }}>Revista</h3>
                  <p style={{ fontSize: 16, color: 'var(--text)' }}>
                    {journal.repositoryName} • {journal.schoolName}
                  </p>
                </div>
              )}

              <div style={{ 
                marginTop: 32, 
                padding: 16, 
                background: '#f8f9fa', 
                borderRadius: 8,
                borderLeft: '4px solid var(--primary)'
              }}>
                <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>
                  <i className="fas fa-info-circle" style={{ marginRight: 8 }}></i>
                  Este artigo foi aprovado para publicação na revista {journal?.repositoryName || `#${journalId}`}. 
                  Para acessar o conteúdo completo, entre em contato com a escola responsável.
                </p>
              </div>
            </div>
          </article>
        </section>
      </div>
      
      {/* Modal de Comentários */}
      {showCommentsModal && article && (
        <CommentsModal
          entityType="article"
          entityId={article.id}
          commentId={article.commentId || null}
          onClose={() => setShowCommentsModal(false)}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
}
