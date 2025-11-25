"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProgramsClient } from "@/app/api/client/dataFetching.client";
import type { Program } from "@/app/types";
import styles from "../../../trainers/clients/[id]/clientProgramsPage.module.css";

export default function ClientProgramsPage() {
    const { id } = useParams();
    const clientId = Array.isArray(id) ? id[0] : id;

    const [programs, setPrograms] = useState<Program[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!clientId) {
            setError("Client ID mangler!");
            setLoading(false);
            return;
        }

        async function loadPrograms() {
            try {
                const data = await fetchProgramsClient(clientId);
                setPrograms(data);
                if (data.length === 1) {
                    setSelectedProgram(data[0]);
                }
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError(String(err));
            } finally {
                setLoading(false);
            }
        }

        loadPrograms();
    }, [clientId]);

    if (loading) return <p className={`${styles.info} text-lg`}>Indlæser programmer...</p>;
    if (error) return <p className={`${styles.error} text-lg`}>{error}</p>;
    if (!programs.length) return <p className={`${styles.info} text-lg`}>Ingen programmer fundet.</p>;

    if (!selectedProgram && programs.length > 1) {
        return (
            <div className={styles.container}>
                <h1 className="text-4xl font-bold mb-6">Vælg et program</h1>
                <ul className="space-y-4">
                    {programs.map((program) => (
                        <li
                            key={program.workoutProgramId}
                            className="cursor-pointer p-4 border rounded-lg hover:bg-gray-100 transition"
                            onClick={() => setSelectedProgram(program)}
                        >
                            <h2 className="text-2xl font-semibold">{program.name}</h2>
                            <p className="text-gray-600">{program.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    const programToShow = selectedProgram || programs[0];

    return (
        <div className={styles.container}>
            <h1 className="text-5xl font-bold mb-4">{programToShow.name}</h1>
            <p className="text-lg text-gray-700 mb-6">{programToShow.description}</p>

            {programToShow.exercises.length === 0 ? (
                <p className="text-gray-500 text-lg">Ingen øvelser endnu.</p>
            ) : (
                <ul className="space-y-4">
                    {programToShow.exercises.map((ex) => (
                        <li key={ex.id} className="p-4 border rounded-lg">
                            <h2 className="text-2xl font-semibold">{ex.name}</h2>
                            <p className="text-gray-600">{ex.description}</p>
                            <div className="mt-1 text-gray-700">
                                {ex.sets !== null && <span className="mr-4">Sæt: {ex.sets}</span>}
                                {ex.reps && <span className="mr-4">Reps: {ex.reps}</span>}
                                {ex.time && <span>Tid: {ex.time}</span>}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {programs.length > 1 && (
                <button
                    className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setSelectedProgram(null)}
                >
                    Tilbage til listen
                </button>
            )}
        </div>
    );
}
