import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/app/types";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const role = decoded.Role || decoded.Role;
        const exp = decoded.exp ? Number(decoded.exp) : null;

        // token expired
        if (exp && exp * 1000 < Date.now()) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Manager adgang til alt
        if (role === "Manager") return NextResponse.next();

        // PersonalTrainer adgang
        if (role === "PersonalTrainer") {
            if (req.nextUrl.pathname.startsWith("/trainers")) {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Client adgang
        if (role === "Client") {
            if (req.nextUrl.pathname.startsWith("/clients")) {
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
