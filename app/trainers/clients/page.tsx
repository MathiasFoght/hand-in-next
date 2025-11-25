"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTrainerClients, createClient, fetchTrainerPrograms } from "@/app/api/client/dataFetching.client";
import type { Client, CreateClient, Program } from "@/app/types";
import styles from "./trainersClientsPage.module.css";

export default function TrainersClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loadingClients, setLoadingClients] = useState(true);
    const [loadingPrograms, setLoadingPrograms] = useState(true);
    const [errorClients, setErrorClients] = useState<string | null>(null);
    const [errorPrograms, setErrorPrograms] = useState<string | null>(null);

    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Hent klienter
    useEffect(() => {
        async function loadClients() {
            try {
                const data = await fetchTrainerClients();
                setClients(data);
            } catch (err: unknown) {
                if (err instanceof Error) setErrorClients(err.message);
                else setErrorClients(String(err));
            } finally {
                setLoadingClients(false);
            }
        }

        loadClients();
    }, []);

    // Hent alle programmer
    useEffect(() => {
        async function loadPrograms() {
            try {
                const data = await fetchTrainerPrograms();
                setPrograms(data);
            } catch (err: unknown) {
                if (err instanceof Error) setErrorPrograms(err.message);
                else setErrorPrograms(String(err));
            } finally {
                setLoadingPrograms(false);
            }
        }

        loadPrograms();
    }, []);

    // Opret klient
    async function handleCreateClient(e: React.FormEvent) {
        e.preventDefault();
        setErrorClients(null);

        const newClient: CreateClient = { firstName, lastName, email, password };

        try {
            await createClient(newClient);
            const updatedClients = await fetchTrainerClients();
            setClients(updatedClients);

            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
        } catch (err: unknown) {
            if (err instanceof Error) setErrorClients(err.message);
            else setErrorClients(String(err));
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Dine klienter</h1>

            {loadingClients && <p>Indlæser klienter...</p>}
            {errorClients && <p className={styles.error}>{errorClients}</p>}
            {!loadingClients && clients.length === 0 && <p>Ingen klienter fundet.</p>}

            {clients.length > 0 && (
                <ul className={styles.list}>
                    {clients.map((c) => (
                        <li key={c.userId} className={styles.listItem}>
                            <Link href={`/trainers/clients/${c.userId}`} className={styles.link}>
                                {c.firstName} {c.lastName}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            <hr className="my-6" />

            <h2 className={styles.title}>Opret ny klient</h2>
            <form onSubmit={handleCreateClient} className={styles.form}>
                <input type="text" placeholder="Fornavn" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <input type="text" placeholder="Efternavn" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Opret klient</button>
            </form>

            <hr className="my-6" />

            <h2 className={styles.title}>All Workout Programs</h2>
            {loadingPrograms && <p>Indlæser programmer...</p>}
            {errorPrograms && <p className={styles.error}>{errorPrograms}</p>}
            {!loadingPrograms && programs.length === 0 && <p>Ingen programmer fundet.</p>}

            {programs.length > 0 && (
                <ul className={styles.list}>
                    {programs.map((p) => (
                        <li
                            key={`${p.clientId}-${p.workoutProgramId}`}
                            className={styles.listItem}
                        >
                            <Link
                                href={`/trainers/clients/${p.clientId}/programs/${p.workoutProgramId}`}
                                className={styles.link}
                            >
                                {p.name} ({p.clientId})
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
