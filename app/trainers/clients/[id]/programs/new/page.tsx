import NewProgramForm from "./newProgramForm";

interface PageProps {
    params: { id: string };
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = await params;
    console.log("Server-side params.id:", resolvedParams.id);

    return <NewProgramForm clientId={resolvedParams.id} />;
}
