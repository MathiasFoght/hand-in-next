import Link from "next/link";
import { fetchTrainerClients } from "@/app/api/dataFetching";
import { Client } from "@/app/types";
import styles from "./trainersClientsPage.module.css";

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

    if (error) return <p className={styles.error}>{error}</p>;
    if (!clients || clients.length === 0) return <p>Ingen klienter fundet.</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Dine klienter</h1>
            <ul className={styles.list}>
                {clients.map((c) => (
                    <li key={c.userId} className={styles.listItem}>
                        <Link href={`/trainers/clients/${c.userId}`} className={styles.link}>
                            {c.firstName} {c.lastName}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );

}