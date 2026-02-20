"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ArticlesPage from "@/components/articles/ArticlesPage";
import { apiFetch, API_URL } from "@/lib/api";

function ArtigoPageContent() {
  const searchParams = useSearchParams();
  const journalId = searchParams.get("journalId");
  const [canCreate, setCanCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCanCreate(false);
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch(`${API_URL}/articles`);
      setCanCreate(res.ok && res.status !== 403);
    } catch {
      setCanCreate(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando...</div>;
  }
  
  return <ArticlesPage showAddButton={canCreate} usePublicEndpoint={!canCreate} preSelectedJournalId={journalId || undefined} />;
}

export default function NovoArtigoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Carregando...</div>}>
      <ArtigoPageContent />
    </Suspense>
  );
}
