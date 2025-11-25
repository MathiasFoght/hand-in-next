import ClientProgramsPage from "./clientProgramsPage";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = await params;
    const clientId = resolvedParams.id;

    console.log("Server-side client ID:", clientId);

    return <ClientProgramsPage clientId={clientId} />;
}
