"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Program } from "@/app/types";
import { fetchProgramsClient } from "@/app/api/client/dataFetching.client";
import styles from "./clientProgramsPage.module.css";

interface ClientProgramsPageProps {
    clientId: string;
}

export default function ClientProgramsPage({ clientId }: ClientProgramsPageProps) {
    const router = useRouter();
    const [programs, setPrograms] = useState<Program[]>([]);
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
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError(String(err));
            } finally {
                setLoading(false);
            }
        }

        loadPrograms();
    }, [clientId]);

    if (loading) return <p className={styles.info}>Indlæser programmer...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Programmer for klient</h1>

            {programs.map((program) => (
                <div key={`${program.workoutProgramId}-${program.clientId}`} className={styles.listItem}>
                    <h2>{program.name}</h2>
                    <p>{program.description}</p>

                    <button
                        className={styles.linkButton}
                        onClick={() =>
                            router.push(`/trainers/clients/${clientId}/programs/${program.workoutProgramId}`)
                        }
                    >
                        Se program
                    </button>
                </div>
            ))}

            <div className={styles.actionButtons}>
                <button
                    className={styles.primaryButton}
                    onClick={() => router.push(`/trainers/clients/${clientId}/programs/new`)}
                >
                    Opret nyt program
                </button>
                <button className={styles.secondaryButton} onClick={() => router.push("/trainers/clients")}>
                    Tilbage til klienter
                </button>
            </div>
        </div>
    );
}
