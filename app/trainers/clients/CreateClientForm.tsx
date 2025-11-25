"use client";
import { useState } from "react";
import styles from "./trainersClientsPage.module.css";

export default function CreateClientForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/trainers/create-client", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Noget gik galt");

            setMessage(`Klient ${data.firstName} ${data.lastName} oprettet!`);
            setFirstName(""); setLastName(""); setEmail(""); setPassword("");
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Opret ny klient</h2>
            <input placeholder="Fornavn" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            <input placeholder="Efternavn" value={lastName} onChange={e => setLastName(e.target.value)} required />
            <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? "Opretter..." : "Opret klient"}</button>
            {message && <p>{message}</p>}
        </form>
    );
}
