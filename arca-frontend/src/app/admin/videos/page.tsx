import VideosPage from '@/components/videos/VideosPage';

export default function RootVideosPage() {
    return <VideosPage showAdminControls={true} showAddButton={true} usePublicEndpoint={false} forceListView={true} />;
}
