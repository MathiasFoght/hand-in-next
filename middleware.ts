import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/app/types";

export function middleware(req: NextRequest) {
    console.log("Middleware triggered for path:", req.nextUrl.pathname);

    const token = req.cookies.get("token")?.value;
    if (!token) {
        console.log("Ingen token, redirect til /login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const decoded = jwtDecode(token) as JwtPayload;
        console.log("Decoded JWT:", decoded);

        const role = decoded.Role;
        const exp = decoded.exp != null ? Number(decoded.exp) : null;

        // Token udløbstjek
        if (exp !== null && !isNaN(exp) && exp * 1000 < Date.now()) {
            console.log("Token udløbet, redirect til /login");
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Rollebaseret adgangskontrol
        const roleMap: Record<string, string> = {
            "/trainers": "PersonalTrainer",
            "/clients": "Client",
            "/admin": "Manager"
        };

        for (const pathPrefix in roleMap) {
            if (req.nextUrl.pathname.startsWith(pathPrefix) && role !== roleMap[pathPrefix]) {
                console.log(`Adgang nægtet til ${pathPrefix} for rolle:`, role);
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
        }

    } catch (e) {
        console.error("JWT decode error:", e);
        return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log("Adgang tilladt, fortsætter til side");
    return NextResponse.next();

}

export const config = {
    matcher: ["/trainers/:path*", "/clients/:path*", "/admin/:path*"]
};