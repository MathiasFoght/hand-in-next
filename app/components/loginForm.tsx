"use client";
import { useState } from "react";
import {login} from "@/lib/auth";
import {JwtPayload} from "@/app/types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await login(email, password);

            if (!res.jwt) throw new Error("No token received");

            Cookies.set("token", res.jwt, { expires: 1 }); // 1 dag

            const decoded = jwtDecode<JwtPayload>(res.jwt);
            const role = decoded.Role;

            if (role === "Manager") {
                router.push("/trainers");
            } else if (role === "PersonalTrainer") {
                router.push("/trainers/clients");
            } else if (role === "Client") {
                router.push("/[id]/programs");
            } else {
                router.push("/unauthorized");
            }
        } catch (err) {
            console.error(err);
            setError("Login failed. Check email and password.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-20">
            <h1 className="text-2xl font-bold">Login</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded"
            />
            <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                Login
            </button>
            {error && <p className="text-red-600">{error}</p>}
        </form>
    );
}
