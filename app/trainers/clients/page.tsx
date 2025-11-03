import Link from "next/link";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/apiClient";
import { Client as ClientType } from "@/app/types";

export default async function TrainersClientsPage() {
    let clients: ClientType[] = [];
    let error: string | null = null;

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        clients = await apiFetch("/api/trainers/clients", token);
    } catch (e: unknown) {
        if (e instanceof Error) error = e.message;
        else error = String(e);
    }

    if (error) return <p className="text-red-600">{error}</p>;
    if (!clients || clients.length === 0) return <p>Ingen klienter fundet.</p>;

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
