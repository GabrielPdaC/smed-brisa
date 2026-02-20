import ArticlesPage from "@/components/articles/ArticlesPage";

interface PageProps {
  params: {
    id: string;
  };
}

export default function JournalArticlesPage({ params }: PageProps) {
  return (
    <ArticlesPage 
      showAdminControls={true} 
      showAddButton={true} 
      usePublicEndpoint={false}
      preSelectedJournalId={params.id}
    />
  );
}
