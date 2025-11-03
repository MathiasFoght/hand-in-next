"use client";

import { useRouter } from "next/navigation";
import {useEffect} from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "@/app/types";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token");

        if (!token) {
            router.replace("/login");
            return;
        }

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            const role = decoded.Role;
            const exp = decoded.exp ? Number(decoded.exp) : null;

            // token udløbet
            if (exp && exp * 1000 < Date.now()) {
                Cookies.remove("token");
                router.replace("/login");
                return;
            }

            // Rollebaseret redirect
            switch (role) {
                case "Manager":
                    router.replace("/trainers");
                    break;
                case "PersonalTrainer":
                    router.replace("/trainers/clients");
                    break;
                case "Client":
                    router.replace("/clients");
                    break;
                default:
                    router.replace("/unauthorized");
                    break;
            }
        } catch (err) {
            console.error("JWT decode error:", err);
            Cookies.remove("token");
            router.replace("/login");
        }
    }, [router]);

    const handleLoginRedirect = () => {
        router.push("/login");
    };

    const containerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to bottom, #4ade80, #3b82f6)",
        color: "white",
        textAlign: "center",
        padding: "40px",
    };

    const buttonStyle: React.CSSProperties = {
        backgroundColor: "white",
        color: "#16a34a",
        fontWeight: "bold",
        padding: "16px 32px",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "18px",
        marginTop: "30px",
        transition: "transform 0.2s",
    };

    const imageStyle: React.CSSProperties = {
        maxWidth: "800px",
        width: "100%",
        borderRadius: "16px",
        marginBottom: "40px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
    };

    return (
        <div style={containerStyle}>
            <h1 style={{ fontSize: "64px", fontWeight: "800", marginBottom: "20px" }}>
                FitLife
            </h1>
            <img
                src="/fitness.jpg"
                alt="Fitness illustration"
                style={imageStyle}
            />
            <p style={{ fontSize: "20px"}}>
                Velkommen! Kom i gang med dit træningsprogram og nå dine mål.
            </p>
            <button
                style={buttonStyle}
                onClick={handleLoginRedirect}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
                Log ind
            </button>
        </div>
    );

}