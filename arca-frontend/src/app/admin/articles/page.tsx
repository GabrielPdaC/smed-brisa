import ArticlesPage from "@/components/articles/ArticlesPage";

export default function RootArticlesPage() {
  return <ArticlesPage showAdminControls={true} showAddButton={true} usePublicEndpoint={false} />;
}
