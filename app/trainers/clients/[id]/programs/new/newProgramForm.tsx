"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProgramForClient } from "@/app/api/client/dataFetching.client";
import styles from "./newProgramPage.module.css";

interface NewProgramFormProps {
    clientId: string;
}

interface NewExercise {
    name: string;
    description: string;
    sets: number | null;
    repetitions: number | null;
    time: string;
}

export default function NewProgramForm({ clientId }: NewProgramFormProps) {
    const router = useRouter();

    console.log("ClientId received:", clientId);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [exercises, setExercises] = useState<NewExercise[]>([]);

    const [exName, setExName] = useState("");
    const [exDesc, setExDesc] = useState("");
    const [exSets, setExSets] = useState<number | null>(null);
    const [exReps, setExReps] = useState<number | null>(null);
    const [exTime, setExTime] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const addExercise = () => {
        if (!exName.trim()) {
            setError("Øvelsen skal have et navn");
            return;
        }

        setExercises((prev) => [
            ...prev,
            {
                name: exName,
                description: exDesc,
                sets: exSets,
                repetitions: exReps,
                time: exTime,
            },
        ]);

        // Reset exercise fields
        setExName("");
        setExDesc("");
        setExSets(null);
        setExReps(null);
        setExTime("");
        setError(null);
    };

    const removeExercise = (index: number) => {
        setExercises((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createProgramForClient({
                clientId,
                name,
                description,
                exercises,
            });

            router.push(`/trainers/clients/${clientId}`);
        } catch {
            setError("Noget gik galt");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Opret nyt program</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <p className={styles.error}>{error}</p>}

                {/* Program Info */}
                <label className={styles.label}>
                    Navn på program:
                    <input
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>

                <label className={styles.label}>
                    Beskrivelse:
                    <textarea
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>

                {/* Exercise Builder */}
                <h2>Tilføj øvelse</h2>

                <label className={styles.label}>
                    Navn:
                    <input
                        className={styles.input}
                        value={exName}
                        onChange={(e) => setExName(e.target.value)}
                    />
                </label>

                <label className={styles.label}>
                    Beskrivelse:
                    <textarea
                        className={styles.textarea}
                        value={exDesc}
                        onChange={(e) => setExDesc(e.target.value)}
                    />
                </label>

                <label className={styles.label}>
                    Sæt:
                    <input
                        className={styles.input}
                        type="number"
                        value={exSets ?? ""}
                        onChange={(e) =>
                            setExSets(e.target.value ? Number(e.target.value) : null)
                        }
                    />
                </label>

                <label className={styles.label}>
                    Reps:
                    <input
                        className={styles.input}
                        type="number"
                        value={exReps ?? ""}
                        onChange={(e) =>
                            setExReps(e.target.value ? Number(e.target.value) : null)
                        }
                    />
                </label>

                <label className={styles.label}>
                    Tid:
                    <input
                        className={styles.input}
                        value={exTime}
                        onChange={(e) => setExTime(e.target.value)}
                    />
                </label>

                <button type="button" onClick={addExercise} className={styles.button}>
                    Tilføj øvelse
                </button>

                {/* Show added exercises */}
                {exercises.length > 0 && (
                    <div className={styles.exerciseList}>
                        <h3>Tilføjede øvelser:</h3>

                        <ul>
                            {exercises.map((ex, index) => (
                                <li key={index} className={styles.exerciseItem}>
                                    <strong>{ex.name}</strong> – {ex.description}
                                    <br />
                                    {ex.sets && <span>Sæt: {ex.sets} </span>}
                                    {ex.repetitions && <span>Reps: {ex.repetitions} </span>}
                                    {ex.time && <span>Tid: {ex.time}</span>}
                                    <br />
                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={() => removeExercise(index)}
                                    >
                                        Fjern
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? "Opretter..." : "Opret program"}
                </button>
            </form>
        </div>
    );
}
