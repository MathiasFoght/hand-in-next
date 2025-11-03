import { jwtDecode } from "jwt-decode";
import {BASE_URL} from "@/app/constants";
import {JwtPayload} from "@/app/types";

export async function login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/api/Users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error("Login failed");
    }

    const data = await res.json();
    return data;
}

export function getToken(): string | null {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

export function getUserRole(): string | null {
    const token = getToken();
    if (!token) return null;
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.Role || null;
    } catch {
        return null;
    }
}

export function isLoggedIn(): boolean {
    const token = getToken();
    if (!token) return false;
    try {
        const { exp } = jwtDecode<JwtPayload>(token);
        return !!exp && parseInt(exp) * 1000 > Date.now();
    } catch {
        return false;
    }
}
