"use client";

import { useState } from "react";
import type { Program, Exercise } from "@/app/types";
import { addExerciseToProgram } from "@/app/api/client/dataFetching.client";



interface EditProgramFormProps {
    clientId: string;
    programId: string;
    program: Program;
}

interface NewExercise {
    name: string;
    description: string;
    sets: number | null;
    repetitions: number | null;
    time: string;
}

export default function EditProgramForm({
                                            clientId,
                                            programId,
                                            program,
                                        }: EditProgramFormProps) {

    const [exercises, setExercises] = useState<Exercise[]>(program.exercises);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [sets, setSets] = useState<number | null>(null);
    const [reps, setReps] = useState<number | null>(null);
    const [time, setTime] = useState("");
    const [message, setMessage] = useState("");

    const addExercise = async () => {
        if (!name.trim()) {
            setMessage("Øvelsen skal have et navn");
            return;
        }

        const newExercise = {
            name,
            description,
            sets,
            repetitions: reps,
            time,
        };

        try {
            const created = await addExerciseToProgram(programId, newExercise);

            setExercises((prev) => [...prev, created]);

            // Reset fields
            setName("");
            setDescription("");
            setSets(null);
            setReps(null);
            setTime("");

            setMessage("Øvelse tilføjet!");
        } catch (e) {
            if (e instanceof Error) setMessage(e.message);
            else setMessage("Der opstod en fejl.");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Rediger: {program.name}</h1>

            <h2 className="text-xl font-semibold">Eksisterende øvelser</h2>

            {exercises.length === 0 ? (
                <p>Ingen øvelser endnu.</p>
            ) : (
                <ul className="space-y-3">
                    {exercises.map((ex) => (
                        <li key={ex.id} className="border p-4 rounded-lg">
                            <h3 className="text-lg font-semibold">{ex.name}</h3>
                            <p>{ex.description}</p>

                            <p>
                                {ex.sets && <>Sæt: {ex.sets} </>}
                                {ex.reps && <>Reps: {ex.reps} </>}
                                {ex.time && <>Tid: {ex.time}</>}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            <hr />

            <h2 className="text-xl font-semibold">Tilføj ny øvelse</h2>

            {message && <p className="text-blue-600">{message}</p>}

            <div className="space-y-4">
                <input
                    placeholder="Navn"
                    className="border p-2 rounded w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    placeholder="Beskrivelse"
                    className="border p-2 rounded w-full"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    placeholder="Sæt"
                    type="number"
                    className="border p-2 rounded w-full"
                    value={sets ?? ""}
                    onChange={(e) => setSets(e.target.value ? Number(e.target.value) : null)}
                />

                <input
                    placeholder="Reps"
                    type="number"
                    className="border p-2 rounded w-full"
                    value={reps ?? ""}
                    onChange={(e) => setReps(e.target.value ? Number(e.target.value) : null)}
                />

                <input
                    placeholder="Tid (fx 30 sek)"
                    className="border p-2 rounded w-full"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={addExercise}
                >
                    Tilføj øvelse
                </button>
            </div>

            <a
                href={`/trainers/clients/${clientId}`}
                className="text-blue-600 mt-6 inline-block"
            >
                Tilbage
            </a>
        </div>
    );
}
