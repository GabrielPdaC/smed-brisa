'use client';

import { useEffect, useState } from 'react';
import { apiFetch, API_URL } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

interface Comment {
    id: number;
    userId: number;
    userName: string;
    comment: string;
    nextCommentId: number | null;
    createdAt: string;
}

interface CommentsModalProps {
    entityType: 'article' | 'video';
    entityId: number;
    commentId: number | null;
    onClose: () => void;
    onCommentAdded?: (commentId: number) => void;
}

export default function CommentsModal({ entityType, entityId, commentId, onClose, onCommentAdded }: CommentsModalProps) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [currentCommentId, setCurrentCommentId] = useState<number | null>(commentId);

    useEffect(() => {
        setCurrentCommentId(commentId);
    }, [commentId]);

    useEffect(() => {
        if (currentCommentId) {
            fetchComments();
        }
    }, [currentCommentId]);

    const fetchComments = async () => {
        if (!currentCommentId) return;
        
        setLoading(true);
        try {
            const res = await apiFetch(`${API_URL}/comments/chain/${currentCommentId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setSubmitting(true);
        setMessage('');

        try {
            // Encontra o último comentário da cadeia
            const lastCommentId = comments.length > 0 ? comments[comments.length - 1].id : null;

            const payload = {
                userId: user.id,
                comment: newComment.trim(),
                nextCommentId: null
            };

            const res = await apiFetch(`${API_URL}/comments`, {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const createdComment = await res.json();
                
                // Se já existem comentários, atualiza o último para apontar para o novo
                if (lastCommentId) {
                    await apiFetch(`${API_URL}/comments/${lastCommentId}`, {
                        method: 'PUT',
                        body: JSON.stringify({ nextCommentId: createdComment.id }),
                    });
                } else {
                    // Se é o primeiro comentário, atualiza o ID local e notifica para atualizar a entidade
                    setCurrentCommentId(createdComment.id);
                    if (onCommentAdded) {
                        onCommentAdded(createdComment.id);
                    }
                }

                setNewComment('');
                setMessage('Comentário adicionado com sucesso!');
                setMessageType('success');
                fetchComments();
            } else {
                setMessage('Erro ao adicionar comentário.');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Erro na conexão com o servidor.');
            setMessageType('error');
        }
        setSubmitting(false);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20
        }} onClick={onClose}>
            <div style={{
                background: 'var(--card-bg)',
                color: 'var(--foreground)',
                borderRadius: 12,
                maxWidth: 700,
                width: '100%',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)'
            }} onClick={(e) => e.stopPropagation()}>
                {/* Cabeçalho */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0, fontSize: 20, color: 'var(--foreground)' }}>Comentários</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: 24,
                            cursor: 'pointer',
                            color: 'var(--foreground)',
                            padding: 0,
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Lista de comentários */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: 24
                }}>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: 'var(--muted-text)' }}>Carregando comentários...</p>
                    ) : comments.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--muted-text)' }}>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {comments.map((comment, index) => (
                                <div key={comment.id} style={{
                                    background: 'var(--card-secondary)',
                                    padding: 16,
                                    borderRadius: 8,
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: 8
                                    }}>
                                        <strong style={{ fontSize: 14, color: 'var(--foreground)' }}>{comment.userName}</strong>
                                        <small style={{ color: 'var(--muted-text)', fontSize: 12 }}>
                                            {new Date(comment.createdAt).toLocaleString('pt-BR')}
                                        </small>
                                    </div>
                                    <p style={{
                                        margin: 0,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        color: 'var(--foreground)'
                                    }}>
                                        {comment.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Formulário de novo comentário */}
                <div style={{
                    padding: 24,
                    borderTop: '1px solid var(--border-color)'
                }}>
                    {message && (
                        <div style={{
                            background: messageType === 'success' ? '#d1fae5' : '#fee2e2',
                            border: `1px solid ${messageType === 'success' ? '#10b981' : '#ef4444'}`,
                            color: messageType === 'success' ? '#065f46' : '#dc2626',
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 16,
                            fontSize: 14
                        }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escreva seu comentário..."
                            rows={3}
                            style={{
                                width: '100%',
                                padding: 12,
                                border: '1px solid var(--border-color)',
                                borderRadius: 8,
                                background: 'var(--input-bg)',
                                color: 'var(--foreground)',
                                resize: 'vertical',
                                fontSize: 14,
                                fontFamily: 'inherit'
                            }}
                            required
                        />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 12,
                            marginTop: 12
                        }}>
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn"
                                style={{ padding: '8px 16px' }}
                            >
                                Fechar
                            </button>
                            <button
                                type="submit"
                                className="btn-login"
                                disabled={submitting || !newComment.trim()}
                                style={{ padding: '8px 16px' }}
                            >
                                {submitting ? 'Enviando...' : 'Adicionar Comentário'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
