import {BASE_URL} from "@/app/constants";
import Cookies from "js-cookie";

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

export function logout() {
    Cookies.remove("token");
    window.location.href = "/";
}
