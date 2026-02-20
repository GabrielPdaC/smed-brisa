import JournalsPage from "@/components/journals/JournalsPage";

export default function RootJournalsPage() {
  return <JournalsPage showAdminControls={true} showAddButton={true} usePublicEndpoint={false} />;
}
