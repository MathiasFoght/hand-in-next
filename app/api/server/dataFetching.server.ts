import { apiFetch } from "@/lib/apiClient";
import { cookies } from "next/headers";
import type { Client, Program, CreateTrainer, CreateClient } from "@/app/types";

export async function getServerToken(): Promise<string> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Ingen token fundet");
    return token;
}

export async function fetchTrainerClients(): Promise<Client[]> {
    const token =await getServerToken();
    return apiFetch("/api/Users/Clients", token);
}

export async function fetchPrograms(id: string): Promise<Program[]> {
    const token = await getServerToken();
    return apiFetch(`/api/WorkoutPrograms/client/${id}`, token);
}

export async function fetchProgramById(programId: string): Promise<Program> {
    const token = await getServerToken();
    return apiFetch(`/api/WorkoutPrograms/${programId}`, token);
}

export async function createTrainer(data: CreateTrainer) {
    const token = await getServerToken();
    const body = { ...data, personalTrainerId: 0, accountType: "PersonalTrainer" };
    return apiFetch("/api/Users", token, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function createClient(data: CreateClient) {
    const token = await getServerToken();
    const body = { ...data, personalTrainerId: 0, accountType: "Client" };
    return apiFetch("/api/Users", token, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function deleteClient(id: number) {
    const token = await getServerToken();
    return apiFetch(`/api/Users/${id}`, token, { method: "DELETE" });
}
