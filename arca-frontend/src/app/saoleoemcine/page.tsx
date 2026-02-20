import VideosPage from '@/components/videos/VideosPage';

export default function SaoLeoEmCine() {
    return <VideosPage showAdminControls={false} showAddButton={true} usePublicEndpoint={true} forceListView={true} />;
}
