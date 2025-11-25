"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Program } from "@/app/types";
import { fetchProgramById } from "@/app/api/client/dataFetching.client";

export default function ProgramDetailPage() {
    const { id, pid } = useParams() as { id?: string; pid?: string };

    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!pid) {
            setError("Program ID mangler");
            setLoading(false);
            return;
        }

        const loadProgram = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchProgramById(pid);
                setProgram(data);
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError(String(err));
            } finally {
                setLoading(false);
            }
        };

        loadProgram();
    }, [pid]);

    if (loading) return <p>Indlæser program...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!program) return <p>Program ikke fundet.</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">{program.name}</h1>

            {program.exercises.length === 0 ? (
                <p>Ingen øvelser tilføjet endnu.</p>
            ) : (
                <ul className="space-y-3">
                    {program.exercises.map((exercise, index) => {
                        const key = exercise.id ?? `${exercise.name}-${index}`;
                        return (
                            <li key={key} className="border p-4 rounded-lg">
                                <h2 className="text-xl font-semibold">{exercise.name}</h2>
                                <p className="text-gray-600">{exercise.description}</p>
                                {(exercise.sets || exercise.reps || exercise.time) && (
                                    <p className="mt-1">
                                        {exercise.sets && (
                                            <>
                                                <strong>Sæt:</strong> {exercise.sets}{" "}
                                            </>
                                        )}
                                        {exercise.reps && (
                                            <>
                                                <strong>Reps:</strong> {exercise.reps}{" "}
                                            </>
                                        )}
                                        {exercise.time && (
                                            <>
                                                <strong>Tid:</strong> {exercise.time}
                                            </>
                                        )}
                                    </p>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            <Link
                href={`/trainers/clients/${id ?? ""}/programs/${pid}/edit`}
                className="text-blue-600 inline-block"
            >
                Rediger program
            </Link>


        </div>
    );
}
