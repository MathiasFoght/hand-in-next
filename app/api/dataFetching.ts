import { apiFetch } from "@/lib/apiClient";
import {Client, User} from "@/app/types";
import { cookies } from "next/headers";

export async function fetchTrainerClients(): Promise<Client[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new Error("Ingen token fundet");

    return apiFetch("/api/trainers/clients", token);
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