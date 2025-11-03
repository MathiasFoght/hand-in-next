import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import {JwtPayload} from "@/app/types";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token && !req.nextUrl.pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token) {
        try {
            const decoded = jwtDecode<JwtPayload>(token);

            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                return NextResponse.redirect(new URL("/login", req.url));
            }

            const role = decoded.role;

            if (req.nextUrl.pathname.startsWith("/admin") && role !== "Manager") {
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }

            if (req.nextUrl.pathname.startsWith("/trainer") && role !== "PersonalTrainer") {
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }

            if (req.nextUrl.pathname.startsWith("/client") && role !== "Client") {
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
        } catch {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/trainer/:path*", "/client/:path*"],
};
