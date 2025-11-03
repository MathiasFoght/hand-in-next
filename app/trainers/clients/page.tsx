"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Client } from "@/app/types";
import {
    createClient,
    fetchTrainerClients,
    deleteClient,
} from "@/app/api/client/dataFetching.client";
import styles from "./trainerClientsPage.module.css"

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
                }
            }
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
        <div className={styles.container}>
            <section className={styles.card}>
                <h1 className={styles.heading}>Opret ny klient</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        <input
                            type="text"
                            placeholder="Fornavn"
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            className={styles.input}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Efternavn"
                            value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            className={styles.input}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className={`${styles.input} ${styles.full}`}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Adgangskode"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className={`${styles.input} ${styles.full}`}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitBtn}
                    >
                        {loading ? "Opretter..." : "Opret klient"}
                    </button>

                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}
                </form>
            </section>

            <section className={styles.card}>
                <h2 className={styles.heading}>Dine klienter</h2>

                {clients.length === 0 ? (
                    <p>Ingen klienter fundet.</p>
                ) : (
                    <ul className={styles.clientList}>
                        {clients.map((c) => (
                            <li key={c.userId} className={styles.clientItem}>
                                <Link
                                    href={`/trainers/clients/${c.userId}`}
                                    className={styles.clientLink}
                                >
                                    {c.firstName} {c.lastName}
                                </Link>
                                <button
                                    onClick={() => handleDelete(c.userId)}
                                    className={styles.deleteBtn}
                                >
                                    Slet
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
