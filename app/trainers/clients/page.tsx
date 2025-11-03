"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Program } from "@/app/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export default function ClientProgramsPage() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [error, setError] = useState<string | null>(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        async function fetchPrograms() {
            if (!token) return;
            try {
                const res = await fetch(`${API_BASE}/api/client/programs`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Kunne ikke hente programmer");
                const data: Program[] = await res.json();
                setPrograms(data);
            } catch (e: unknown) {
                if (e instanceof Error) setError(e.message);
                else setError(String(e));
            }
        }
        fetchPrograms();
    }, [token]);

    if (error) return <p className="text-red-600">{error}</p>;
    if (!programs.length) return <p>Henter programmer...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dine programmer</h1>
            <ul className="space-y-2">
                {programs.map((p) => (
                    <li key={p.id} className="border p-3 rounded">
                        <Link href={`/clients/${p.id}`} className="text-blue-600 font-semibold">
                            {p.name}
                        </Link>
                        <p>{p.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );

}