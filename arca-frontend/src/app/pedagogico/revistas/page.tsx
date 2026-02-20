"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import JournalsPage from "@/components/journals/JournalsPage";
import { apiFetch, API_URL } from "@/lib/api";

function RevistaPageContent() {
  const searchParams = useSearchParams();
  const shouldCreate = searchParams.get("create") === "true";
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
      const res = await apiFetch(`${API_URL}/journals`);
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

  return <JournalsPage showAddButton={canCreate} showAdminControls={false} usePublicEndpoint={!canCreate} startWithFormOpen={shouldCreate && canCreate} />;
}

export default function NovaRevistaPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Carregando...</div>}>
      <RevistaPageContent />
    </Suspense>
  );
}
