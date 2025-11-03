"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BASE_URL } from "@/app/constants";

interface Client {
    id: string;
    name: string;
}

export default function TrainersClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [error, setError] = useState<string | null>(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        async function fetchClients() {
            if (!token) return;
            try {
                const res = await fetch(`${BASE_URL}/api/trainers/clients`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Kunne ikke hente klienter");
                const data: Client[] = await res.json();
                setClients(data);
            } catch (e: unknown) {
                if (e instanceof Error) setError(e.message);
                else setError(String(e));
            }
        }
        fetchClients();
    }, [token]);

    if (error) return <p className="text-red-600">{error}</p>;
    if (!clients.length) return <p>Henter klienter...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dine klienter</h1>
            <ul className="space-y-2">
                {clients.map((c) => (
                    <li key={c.id} className="border p-3 rounded">
                        <Link href={`/trainers/clients/${c.id}`} className="text-blue-600 font-semibold">
                            {c.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
