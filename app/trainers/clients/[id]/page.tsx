import Link from "next/link";
import { Program } from "@/app/types";
import { fetchPrograms } from "@/app/api/dataFetching";

export default async function ClientProgramsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let programs: Program[] = [];
    let error: string | null = null;

    try {
        programs = await fetchPrograms(id);
    } catch (e: unknown) {
        error = e instanceof Error ? e.message : String(e);
    }

    if (error) return <p className="text-red-600">{error}</p>;
    if (!programs?.length) return <p>Ingen programmer fundet for denne klient.</p>;

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Programmer for klient</h1>
            <ul className="space-y-2">
                {programs.map((program) => (
                    <li key={program.workoutProgramId} className="border p-3 rounded hover:bg-gray-50 transition">
                        <Link
                            href={`/trainers/clients/${id}/programs/${program.workoutProgramId}`}
                            className="text-blue-600 font-semibold"
                        >
                            {program.name}
                        </Link>
                    </li>
                ))}
            </ul>

            <Link href="/trainers/clients" className="text-blue-600 mt-6 inline-block">
                Tilbage til klienter
            </Link>
        </div>
    );
}
