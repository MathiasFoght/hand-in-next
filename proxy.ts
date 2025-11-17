import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/app/types";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const role = decoded.Role;
        const exp = decoded.exp ? Number(decoded.exp) : null;
        const path = req.nextUrl.pathname;

        if (exp && exp * 1000 < Date.now()) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (role === "Manager") {
            if (path === "/trainers") {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (role === "PersonalTrainer") {
            if (path.startsWith("/trainers/clients")) {
                return NextResponse.next();
            }
            if (path === "/trainers") {
                return NextResponse.redirect(new URL("/trainers/clients", req.url));
            }
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (role === "Client") {
            if (path.startsWith("/clients")) {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

    } catch (e) {
        console.error("JWT decode error:", e);
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/trainers/:path*", "/clients/:path*"],
};
