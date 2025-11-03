import { apiFetch } from "@/lib/apiClient";
import {Client, Program, User} from "@/app/types";
import { cookies } from "next/headers";

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
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        throw new Error("Ingen token fundet");
    }

    const users: User[] = await apiFetch("/api/Users", token, { method: "GET" });

    const trainers = users.filter(
        (user) => user.accountType === "PersonalTrainer"
    );

    return trainers;
}