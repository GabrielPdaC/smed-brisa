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

export default function JournalDetailsPage() {
  const { apiPermissions } = usePermissions();
  const params = useParams();
  const journalId = params.id as string;
  
  const [journal, setJournal] = useState<Journal | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canCreateArticle, setCanCreateArticle] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Verificar se tem permissão para comentar
  const canComment = apiPermissions.some(perm => {
    const urlPattern = perm.trim();
    return urlPattern === '/api/comments/**' || urlPattern === '/api/**';
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetchJournalData();
  }, [journalId]);

  const fetchJournalData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Tentar com autenticação, se falhar com 403, usar endpoint público
      let journalRes = token ? await apiFetch(`${API_URL}/journals/${journalId}`) : await fetch(`${API_URL}/public/journals/${journalId}`);
      if (journalRes.status === 403) {
        journalRes = await fetch(`${API_URL}/public/journals/${journalId}`);
      }
      
      let articlesRes = token ? await apiFetch(`${API_URL}/articles`) : await fetch(`${API_URL}/public/articles`);
      if (articlesRes.status === 403) {
        articlesRes = await fetch(`${API_URL}/public/articles`);
        setCanCreateArticle(false);
      } else if (articlesRes.ok) {
        setCanCreateArticle(true);
      }

      if (journalRes.ok) {
        setJournal(await journalRes.json());
      }

      if (articlesRes.ok) {
        const allArticles = await articlesRes.json();
        // Filtrar apenas artigos desta revista
        setArticles(allArticles.filter((a: Article) => a.journalId === parseInt(journalId)));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (articleId: number) => {
    try {
      const res = await apiFetch(`${API_URL}/articles/${articleId}/approve`, {
        method: 'PUT'
      });
      
      if (res.ok) {
        setMessage('Artigo aprovado!');
        setMessageType('success');
        fetchJournalData();
      } else {
        setMessage('Erro ao aprovar artigo.');
        setMessageType('error');
      }
    } catch {
      setMessage('Erro de conexão.');
      setMessageType('error');
    }
  };

  const handleReject = async (articleId: number) => {
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
        fetchJournalData();
      } else {
        setMessage('Erro ao rejeitar artigo.');
        setMessageType('error');
      }
    } catch {
      setMessage('Erro de conexão.');
      setMessageType('error');
    }
  };

  const handleOpenComments = (article: Article) => {
    setSelectedArticle(article);
    setShowCommentsModal(true);
  };

  const handleCommentAdded = async (commentId: number) => {
    if (!selectedArticle) return;
    
    // Atualiza o artigo para incluir o primeiro comentário
    try {
      const res = await apiFetch(`${API_URL}/articles/${selectedArticle.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          authors: selectedArticle.authors,
          title: selectedArticle.title,
          url: selectedArticle.url,
          commentId: commentId
        }),
      });
      if (res.ok) {
        fetchJournalData();
      }
    } catch (error) {
      console.error('Erro ao atualizar artigo com comentário:', error);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'pub';
      case 'REJECTED': return 'rejected';
      default: return 'pending';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'Aprovado';
      case 'REJECTED': return 'Rejeitado';
      default: return 'Pendente';
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.authors.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '40px' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="main-content">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '40px' }}>Revista não encontrada.</p>
          <div style={{ textAlign: 'center' }}>
            <Link href="/pedagogico" className="btn view">Voltar para Pedagógico</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <header className="header">
          <div className="logo-box"><i className="fas fa-book-open" /></div>
          <div className="header-content">
            <h1>{journal.repositoryName}</h1>
            <p className="description">
              {journal.schoolName} • Responsável: {journal.userName}
            </p>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>
              Período de submissão: {new Date(journal.openingDate).toLocaleDateString('pt-BR')}
              {journal.closingDate && ` até ${new Date(journal.closingDate).toLocaleDateString('pt-BR')}`}
            </p>
          </div>
          <div className="controls">
            <Link href="/pedagogico" className="btn view">
              ← Voltar
            </Link>
            {canCreateArticle && journal.status === 'OPEN' && (
              <Link href={`/pedagogico/artigos?journalId=${journalId}`} className="btn download">
                + Novo Artigo
              </Link>
            )}
          </div>
        </header>

        {message && (
          <div style={{
            background: messageType === 'success' ? '#d1fae5' : '#fee2e2',
            border: `1px solid ${messageType === 'success' ? '#10b981' : '#ef4444'}`,
            color: messageType === 'success' ? '#065f46' : '#dc2626',
            padding: 12,
            borderRadius: 8,
            marginBottom: 16
          }}>
            {message}
          </div>
        )}

        <div className="meta-row" style={{ marginTop: 24 }}>
          <div>
            <span className="pill pub">{journal.status === 'OPEN' ? 'Aberta' : 'Fechada'}</span>
            <span style={{ marginLeft: 12 }}>{filteredArticles.length} artigo(s) publicado(s)</span>
          </div>
        </div>

        {articles.length > 0 && (
          <div className="search-and-filters" style={{ marginTop: 24, marginBottom: 24 }}>
            <div className="search modern">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-4.35-4.35" stroke="#9aa6b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="11" cy="11" r="7" stroke="#9aa6b2" strokeWidth="1.6" />
              </svg>
              <input 
                type="text" 
                placeholder="Buscar artigos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        <section className="grid">
          {filteredArticles.map((article) => (
            <article key={article.id} className="card">
              <div className="top">
                <span className={`pill ${getStatusClass(article.status)}`}>{getStatusText(article.status)}</span>
                <div className="file-info">Artigo</div>
              </div>
              <h3>{article.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
                {article.authors} • {new Date(article.createdAt).toLocaleDateString('pt-BR')}
              </p>
              <p>Artigo científico {article.status === 'APPROVED' ? 'aprovado para publicação' : article.status === 'REJECTED' ? 'rejeitado' : 'aguardando avaliação'}</p>
              <div className="tags">
                <span className="tag">{getStatusText(article.status)}</span>
                <span className="tag">{article.authors.split(',')[0]}</span>
              </div>
              <div className="actions">
                <div className="small">Por {article.userName}</div>
                <div className="buttons">
                  <Link href={`/pedagogico/revistas/${journalId}/artigo/${article.id}`} className="btn view">
                    Ler Artigo
                  </Link>
                  {canComment && (
                    <button 
                      onClick={() => handleOpenComments(article)}
                      className="btn" 
                      style={{ background: '#3b82f6', color: '#fff', marginLeft: 8 }}
                    >
                      <i className="fas fa-comment" /> Comentários
                    </button>
                  )}
                  {article.url && (
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn download" style={{ marginLeft: 8 }}>
                      <i className="fas fa-external-link-alt" /> Acessar Artigo
                    </a>
                  )}
                  {isLoggedIn && article.status === 'PENDING' && (
                    <>
                      <button className="btn" onClick={() => handleApprove(article.id)} style={{ background: '#10b981', color: '#fff', marginLeft: 8 }}>
                        <i className="fas fa-check" /> Aprovar
                      </button>
                      <button className="btn" onClick={() => handleReject(article.id)} style={{ background: '#f59e0b', color: '#fff', marginLeft: 8 }}>
                        <i className="fas fa-times" /> Rejeitar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}

          {filteredArticles.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
              {searchTerm ? 'Nenhum artigo encontrado com esse termo.' : 'Nenhum artigo publicado nesta revista ainda.'}
            </div>
          )}
        </section>
      </div>
      
      {/* Modal de Comentários */}
      {showCommentsModal && selectedArticle && (
        <CommentsModal
          entityType="article"
          entityId={selectedArticle.id}
          commentId={selectedArticle.commentId || null}
          onClose={() => {
            setShowCommentsModal(false);
            setSelectedArticle(null);
          }}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
}
