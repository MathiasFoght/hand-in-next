import { apiFetch } from "@/lib/apiClient";
import { Client } from "@/app/types";
import { cookies } from "next/headers";

export async function fetchTrainerClients(): Promise<Client[]> {
    const cookieStore = await cookies(); // ✅ ingen await
    const token = cookieStore.get("token")?.value;

    if (!token) throw new Error("Ingen token fundet");

    return apiFetch("/api/trainers/clients", token);
}
