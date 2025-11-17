import Link from "next/link";
import { Program } from "@/app/types";
import { fetchPrograms} from "@/app/api/server/dataFetching.server";
import {fetchProgramById} from "@/app/api/server/dataFetching.server";
import styles from '@/app/trainers/clients/[id]/programs/clientProgramsPage.module.css'

export default async function ClientProgramsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let programs: Program[] = [];
    let error: string | null = null;

    try {
        programs = await fetchPrograms(id);
    } catch (e: unknown) {
        error = e instanceof Error ? e.message : String(e);
    }

    if (error) return <p className={styles.error}>{error}</p>;
    if (!programs?.length) return <p className={styles.error}>Ingen programmer fundet for denne klient.</p>;

// Hvis kun ét program, hent detaljerne og vis direkte
    if (programs.length === 1) {
        const singleProgram = programs[0];
        let programDetail: Program | null = null;
        let detailError: string | null = null;

        try {
            programDetail = await fetchProgramById(singleProgram.workoutProgramId);
        } catch (e: unknown) {
            detailError = e instanceof Error ? e.message : String(e);
        }

        if (detailError) return <p className={styles.error}>{detailError}</p>;
        if (!programDetail) return <p className={styles.error}>Program ikke fundet.</p>;

        return (
            <div className={styles.container}>
                <h1 className={styles.title}>{programDetail.name}</h1>

                {programDetail.exercises.length === 0 ? (
                    <p>Ingen øvelser tilføjet endnu.</p>
                ) : (
                    <ul className={styles.list}>
                        {programDetail.exercises.map((exercise) => (
                            <li key={exercise.id} className={styles.listItem}>
                                <h2 className={styles.exerciseName}>{exercise.name}</h2>
                                {exercise.description && <p className={styles.exerciseDescription}>{exercise.description}</p>}
                                {(exercise.sets || exercise.reps || exercise.time) && (
                                    <p className={styles.exerciseDetails}>
                                        {exercise.sets !== null && <><strong>Sæt:</strong> {exercise.sets} </>}
                                        {exercise.reps && <><strong>Reps:</strong> {exercise.reps} </>}
                                        {exercise.time && <><strong>Tid:</strong> {exercise.time}</>}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                <Link href="/trainers/clients" className={styles.backLink}>
                    Tilbage til klienter
                </Link>
            </div>
        );
    }

// Flere programmer → vis liste
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Programmer for klient</h1>
            <ul className={styles.list}>
                {programs.map((program) => (
                    <li key={program.workoutProgramId} className={styles.listItem}>
                        <Link
                            href={`/trainers/clients/${id}/programs/${program.workoutProgramId}`}
                            className={styles.link}
                        >
                            {program.name}
                        </Link>
                    </li>
                ))}
            </ul>

            <Link href="/trainers/clients" className={styles.backLink}>
                Tilbage til klienter
            </Link>
        </div>
    );

}