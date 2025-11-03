// types.ts

/** Basic user info (Trainer, Manager, or Client) */
export interface User {
    id: string;
    name: string;
    email: string;
    role: "manager" | "trainer" | "client";
}

/** A client for a personal trainer */
export interface Client {
    id: string;
    name: string;
    email: string;
    trainerId?: string; // optional — depends on backend model
}

/** A workout exercise belonging to a program */
export interface Exercise {
    id: string;
    name: string;
    description: string;
    sets: number;
    /** Either repetitions OR time (seconds) */
    reps?: number;
    time?: number;
}

/** A workout program assigned to a client */
export interface Program {
    id: string;
    name: string;
    description: string;
    clientId: string;
    exercises: Exercise[];
}
