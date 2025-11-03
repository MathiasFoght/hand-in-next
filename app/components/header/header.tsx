"use client";

import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth";
import styles from "./header.module.css";

export default function Header() {
    const pathname = usePathname();

    const hideHeader =
        pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/unauthorized");

    if (hideHeader) return null;

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>FitLife</h1>
            <button onClick={logout} className={styles.button}>
                Logout
            </button>
        </header>
    );
}
