"use client";

import { apiFetch } from "@/lib/apiClient";
import Cookies from "js-cookie";
import type {User, CreateTrainer, CreateClient, Client, JwtPayload} from "@/app/types";
import {jwtDecode} from "jwt-decode";

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
