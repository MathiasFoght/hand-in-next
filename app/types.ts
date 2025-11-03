export type JwtPayload = {
    sub?: string;
    email?: string;
    Role?: string; // Matcher backend JWT
    exp?: string; // JWT giver exp som string
    nbf?: string;
    UserId?: string;
    GroupId?: string;
};

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

/** A User */
export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    personalTrainerId: number | null;
    accountType: "PersonalTrainer" | "Client";
}
