export type JwtPayload = {
    sub?: string;
    email?: string;
    Role?: string;
    exp?: string;
    nbf?: string;
    UserId?: string;
    GroupId?: string;
};

export interface Client {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    personalTrainerId?: number;
    accountType: "Client";
}

export interface Exercise {
    id: string;
    name: string;
    description: string;
    sets: number;
    reps?: number;
    time?: number;
}

export interface Program {
    workoutProgramId: string;
    name: string;
    description: string;
    clientId: string;
    exercises: Exercise[];
}

export interface CreateProgramData {
    clientId: string;
    name: string;
    description: string;
}

export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    personalTrainerId: number | null;
    accountType: "PersonalTrainer" | "Client";
}

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
