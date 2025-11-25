"use client";

import { apiFetch } from "@/lib/apiClient";
import Cookies from "js-cookie";
import type {User, CreateTrainer, CreateClient, Client, JwtPayload, Program} from "@/app/types";
import {jwtDecode} from "jwt-decode";
import {getServerToken} from "@/app/api/server/dataFetching.server";

function getClientToken(): string {
    const token = Cookies.get("token");
    if (!token) throw new Error("Ingen token fundet");
    return token;
}

export async function fetchTrainerClients(): Promise<Client[]> {
    const token = getClientToken();
    return apiFetch("/api/Users/Clients", token);
}

export async function fetchTrainers(): Promise<User[]> {
    const token = getClientToken();
    const users: User[] = await apiFetch("/api/Users", token, { method: "GET" });
    return users.filter((u) => u.accountType === "PersonalTrainer");
}

export async function createTrainer(data: CreateTrainer) {
    const token = getClientToken();
    const body = { ...data, personalTrainerId: 0, accountType: "PersonalTrainer" };
    return apiFetch("/api/Users", token, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function deleteTrainer(id: number) {
    const token = getClientToken();
    return apiFetch(`/api/Users/${id}`, token, { method: "DELETE" });
}

export async function createClient(data: CreateClient) {
    const token = getClientToken();
    if (!token) throw new Error("Ingen token fundet");

    const decoded = jwtDecode<JwtPayload>(token);
    const trainerId = decoded.UserId ? parseInt(decoded.UserId, 10) : null;

    if (!trainerId) {
        throw new Error("Kunne ikke finde træner-ID i token");
    }

    const body = {
        ...data,
        personalTrainerId: trainerId,
        accountType: "Client",
    };

    return apiFetch("/api/Users", token, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function deleteClient(id: number) {
    const token = getClientToken();
    return apiFetch(`/api/Users/${id}`, token, { method: "DELETE" });
}

export async function fetchTrainerPrograms(): Promise<Program[]> {
    const token = getClientToken();
    return apiFetch("/api/Exercises", token, {
        method: "GET",
    });
}

export async function addExerciseToProgram(
    programId: string,
    exercise: {
        name: string;
        description: string;
        sets: number | null;
        repetitions: number | null;
        time: string;
    }
) {
    const token = getClientToken();
    if (!token) throw new Error("Ingen token fundet");

    return apiFetch(`/api/Exercises/Program/${programId}`, token, {
        method: "POST",
        body: JSON.stringify(exercise),
    });
}

export async function fetchProgramsClient(clientId: string): Promise<Program[]> {
    if (!clientId) throw new Error("Client ID mangler!");
    const token = getClientToken();
    return apiFetch(`/api/WorkoutPrograms/client/${clientId}`, token);
}

export async function fetchProgramById(programId: string): Promise<Program> {
    const token = getClientToken();
    return apiFetch(`/api/WorkoutPrograms/${programId}`, token);
}
export interface CreateExerciseData {
    name: string;
    description: string;
    sets: number | null;
    repetitions: number | null;
    time: string;
}

export async function createProgramForClient(data: {
    clientId: string;
    name: string;
    description: string;
    exercises: CreateExerciseData[];
}) {
    const token = getClientToken();
    if (!token) throw new Error("Ingen token fundet");

    const body = {
        name: data.name,
        description: data.description,
        clientId: Number(data.clientId),
        exercises: data.exercises
    };

    return apiFetch("/api/WorkoutPrograms", token, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

