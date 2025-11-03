import Link from "next/link";
import { fetchTrainerClients } from "@/app/api/dataFetching";
import { Client} from "@/app/types";

export default async function TrainersClientsPage() {
    let clients: Client[] = [];
    let error: string | null = null;

    try {
        clients = await fetchTrainerClients();
        console.log(clients);
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
                    <li key={c.userId} className="border p-3 rounded">
                        <Link href={`/trainers/clients/${c.userId}`} className="text-blue-600 font-semibold">
                            {c.firstName} {c.lastName}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
