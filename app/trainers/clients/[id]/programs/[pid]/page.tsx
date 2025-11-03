import Link from "next/link";
import { fetchProgramById } from "@/app/api/server/dataFetching.server";
import { Program } from "@/app/types";

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string; pid: string }> }) {
    const { id, pid } = await params;

    let program: Program | null = null;
    let error: string | null = null;

    try {
        program = await fetchProgramById(pid);
    } catch (e: unknown) {
        error = e instanceof Error ? e.message : String(e);
    }

    if (error) return <p className="text-red-600">{error}</p>;
    if (!program) return <p>Program ikke fundet.</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">{program.name}</h1>

            {program.exercises.length === 0 ? (
                <p>Ingen øvelser tilføjet endnu.</p>
            ) : (
                <ul className="space-y-3">
                    {program.exercises.map((exercise) => (
                        <li key={exercise.id} className="border p-4 rounded-lg">
                            <h2 className="text-xl font-semibold">{exercise.name}</h2>
                            <p className="text-gray-600">{exercise.description}</p>
                            {(exercise.sets || exercise.reps || exercise.time) && (
                                <p className="mt-1">
                                    {exercise.sets ? (
                                        <>
                                            <strong>Sæt:</strong> {exercise.sets}{" "}
                                        </>
                                    ) : null}
                                    {exercise.reps ? (
                                        <>
                                            <strong>Reps:</strong> {exercise.reps}{" "}
                                        </>
                                    ) : null}
                                    {exercise.time ? (
                                        <>
                                            <strong>Tid:</strong> {exercise.time}
                                        </>
                                    ) : null}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <Link href={`/trainers/clients/${id}`} className="text-blue-600 mt-4 inline-block">
                Tilbage til programmer
            </Link>
        </div>
    );

}