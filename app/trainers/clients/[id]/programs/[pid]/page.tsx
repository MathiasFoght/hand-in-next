"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Program, Exercise } from "@/app/types";
import {BASE_URL} from "@/app/constants";

export default function ClientProgramDetailPage() {
    const { pid } = useParams<{ pid: string }>();
    const [program, setProgram] = useState<Program | null>(null);
    const [error, setError] = useState<string | null>(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        async function fetchProgram() {
            if (!token || !pid) return;
            try {
                const res = await fetch(`${BASE_URL}/api/programs/${pid}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Kunne ikke hente program");
                const data: Program = await res.json();
                setProgram(data);
            } catch (e: unknown) {
                if (e instanceof Error) setError(e.message);
                else setError(String(e));
            }
        }
        fetchProgram();
    }, [pid, token]);

    if (error) return <p className="text-red-600">{error}</p>;
    if (!program) return <p>Henter program...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{program.name}</h1>
            <p className="mb-4">{program.description}</p>

            <h2 className="text-lg font-semibold mb-2">Øvelser</h2>
            {program.exercises?.length ? (
                <ul className="space-y-2">
                    {program.exercises.map((ex: Exercise) => (
                        <li key={ex.id} className="border p-3 rounded">
                            <strong>{ex.name}</strong> ({ex.sets} sæt × {ex.reps ?? ex.time})
                            <p>{ex.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Ingen øvelser endnu.</p>
            )}

            <Link href="/clients" className="text-blue-600 mt-4 inline-block">
                Tilbage til programmer
            </Link>
        </div>
    );

}