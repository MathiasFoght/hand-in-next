export type JwtPayload = {
    sub?: string;
    email?: string;
    Role?: string;
    exp?: string;
    nbf?: string;
    UserId?: string;
    GroupId?: string;
};

/** A client for a personal trainer */
export interface Client {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    personalTrainerId?: number;
    accountType: "Client";
}

/** A workout exercise belonging to a program */
export interface Exercise {
    id: string;
    name: string;
    description: string;
    sets: number;
    reps?: number;
    time?: number;
}

/** A workout program assigned to a client */
export interface Program {
    workoutProgramId: string;
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

/** Creating a new trainer */
export interface CreateTrainer {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface CreateClient {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    personalTrainerId?: number;
    accountType?: "Client";
}
