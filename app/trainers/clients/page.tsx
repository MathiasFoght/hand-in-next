"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Client } from "@/app/types";
import {
    createClient,
    fetchTrainerClients,
    deleteClient,
} from "@/app/api/client/dataFetching.client";

export default function TrainersClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchTrainerClients();
                setClients(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Kunne ikke hente klienter.");
                }            }
        })();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const newClient = await createClient(form);
            setClients((prev) => [...prev, newClient]);
            setForm({ firstName: "", lastName: "", email: "", password: "" });
            setSuccess("Klient oprettet!");
            setTimeout(() => setSuccess(""), 3000);
        } catch {
            setError("Kunne ikke oprette klient.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Er du sikker på, at du vil slette denne klient?")) return;

        try {
            await deleteClient(id);
            setClients((prev) => prev.filter((c) => c.userId !== id));
            setSuccess("Klient slettet!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error(err);
            setError("Kunne ikke slette klienten.");
        }
    };

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">Opret ny klient</h1>

            <form
                onSubmit={handleSubmit}
                className="border p-4 rounded bg-gray-50 space-y-4"
            >
                <h2 className="font-semibold text-lg">Opret ny klient</h2>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="text"
                        placeholder="Fornavn"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Efternavn"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="border p-2 rounded col-span-2"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Adgangskode"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="border p-2 rounded col-span-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    {loading ? "Opretter..." : "Opret klient"}
                </button>

                {error && <p className="text-red-600">{error}</p>}
                {success && <p className="text-green-600">{success}</p>}
            </form>

            <h1 className="text-2xl font-bold">Dine klienter</h1>
            {clients.length === 0 ? (
                <p>Ingen klienter fundet.</p>
            ) : (
                <ul className="space-y-2">
                    {clients.map((c) => (
                        <li
                            key={c.userId}
                            className="border p-3 rounded flex justify-between items-center"
                        >
                            <Link
                                href={`/trainers/clients/${c.userId}`}
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                {c.firstName} {c.lastName}
                            </Link>
                            <button
                                onClick={() => handleDelete(c.userId)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                                Slet
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
