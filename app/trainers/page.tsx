"use client";

import { useEffect, useState } from "react";
import type { User } from "@/app/types";
import { fetchTrainers, createTrainer, deleteTrainer } from "@/app/api/dataFetching";
import styles from "./trainers.module.css";

export default function TrainersPage() {
    const [trainers, setTrainers] = useState<User[]>([]);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchTrainers();
                setTrainers(data);
            } catch {
                setError("Kunne ikke hente trænere");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const newTrainer = await createTrainer(form);
            setSuccess("Trainer created successfully!");
            setTrainers((prev) => [...prev, newTrainer]);
            setForm({ firstName: "", lastName: "", email: "", password: "" });

            setTimeout(() => setSuccess(""), 3000);

        } catch {
            setError("Failed to create trainer.");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Er du sikker på du vil slette denne træner?")) return;
        try {
            console.log("Deleting trainer with ID:", id);
            await deleteTrainer(id);
            setTrainers((prev) => prev.filter((t) => t.userId !== id));
        } catch {
            alert("Kunne ikke slette træner.");
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingContent}>
                    <div className={styles.spinner}></div>
                    <p>Loading trainers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Overblik</h1>
                    <p className={styles.subtitle}>Administrer alle trænere i FitLife</p>
                </div>

                <div className={styles.gridLayout}>
                    <div className={styles.formColumn}>
                        <div className={styles.formCard}>
                            <div className={styles.formHeader}>
                                <div className={styles.iconCircle}>
                                    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <h2 className={styles.formTitle}>Opret Ny Træner</h2>
                            </div>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Fornavn</label>
                                    <input
                                        name="firstName"
                                        placeholder="Indtast fornavn"
                                        value={form.firstName}
                                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                        className={styles.input}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Efternavn</label>
                                    <input
                                        name="lastName"
                                        placeholder="Indtast efternavn"
                                        value={form.lastName}
                                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                        className={styles.input}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="træner@email.dk"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className={styles.input}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Adgangskode</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="********"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className={styles.input}
                                        required
                                    />
                                </div>

                                <button type="submit" className={styles.submitButton}>
                                    Opret Træner
                                </button>

                                {error && (
                                    <div className={styles.errorMessage}>
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className={styles.successMessage}>
                                        {success}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className={styles.listColumn}>
                        <div className={styles.listCard}>
                            <div className={styles.listHeader}>
                                <h2 className={styles.listTitle}>
                                    <svg className={styles.listIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Alle Trænere ({trainers.length})
                                </h2>
                            </div>

                            <div className={styles.listContent}>
                                {trainers.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <div className={styles.emptyIcon}>
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <p className={styles.emptyText}>Ingen trænere fundet</p>
                                        <p className={styles.emptySubtext}>Opret den første træner for at komme i gang</p>
                                    </div>
                                ) : (
                                    <div className={styles.trainersList}>
                                        {trainers.map((trainer) => (
                                            <div key={trainer.userId} className={styles.trainerCard}>
                                                <div className={styles.trainerInfo}>
                                                    <div className={styles.avatar}>
                                                        {trainer.firstName[0]}{trainer.lastName[0]}
                                                    </div>
                                                    <div className={styles.trainerDetails}>
                                                        <p className={styles.trainerName}>
                                                            {trainer.firstName} {trainer.lastName}
                                                        </p>
                                                        <p className={styles.trainerEmail}>
                                                            <svg className={styles.emailIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                            {trainer.email}
                                                        </p>
                                                        <span className={styles.badge}>
                                                            {trainer.accountType}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(trainer.userId)}
                                                    className={styles.deleteButton}
                                                >
                                                    <svg className={styles.deleteIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Slet
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}