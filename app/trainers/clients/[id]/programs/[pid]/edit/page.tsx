import EditProgramForm from "./EditProgramForm";
import { fetchProgramById } from "@/app/api/server/dataFetching.server";

export default async function EditProgramPage({
                                                  params,
                                              }: {
    params: Promise<{ id: string; pid: string }>;
}) {
    const { id, pid } = await params;

    const program = await fetchProgramById(pid);

    return (
        <EditProgramForm
            clientId={id}
            programId={pid}
            program={program}
        />
    );
}
