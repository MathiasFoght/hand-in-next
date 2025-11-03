import {BASE_URL} from "@/app/constants";

export async function apiFetch(path: string, token?: string, options: RequestInit = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("API error response:", errorText);
        throw new Error(`API error: ${res.status}`);    }

    return res.json().catch(() => ({}));
}

