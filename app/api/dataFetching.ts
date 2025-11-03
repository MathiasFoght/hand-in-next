import Cookies from "js-cookie";
import { apiFetch } from "@/lib/apiClient";
import { cookies } from "next/headers";
import type { Client, CreateTrainer, User, Program } from "@/app/types";

export async function fetchTrainerClients(): Promise<Client[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new Error("Ingen token fundet");

    return await apiFetch("/api/Users/Clients", token);
}


export async function fetchPrograms(id: string): Promise<Program[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new Error("Ingen token fundet");

    const programs = await apiFetch(`/api/WorkoutPrograms/client/${id}`, token);

    console.log("programs: ", programs);

    return programs
}

export async function fetchProgramById(programId: string): Promise<Program> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new Error("Ingen token fundet");

    const program = await apiFetch(`/api/WorkoutPrograms/${programId}`, token);

    return program
}



export async function fetchTrainers(): Promise<User[]> {
    const token =
        typeof window === "undefined"
            ? undefined
            : Cookies.get("token");

    if (!token) throw new Error("Ingen token fundet");

    const users: User[] = await apiFetch("/api/Users", token, {
        method: "GET",
    });

    return users.filter((u) => u.accountType === "PersonalTrainer");
}

export async function createTrainer(data: CreateTrainer) {
    const token =
        typeof window === "undefined"
            ? undefined
            : Cookies.get("token");

    if (!token) throw new Error("Ingen token fundet");

    const body = {
        ...data,
        personalTrainerId: 0,
        accountType: "PersonalTrainer",
    };

    return apiFetch("/api/Users", token, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function deleteTrainer(id: number) {
    const token = Cookies.get("token");
    if (!token) throw new Error("Ingen token fundet");

    return apiFetch(`/api/Users/${id}`, token, { method: "DELETE" });
}
