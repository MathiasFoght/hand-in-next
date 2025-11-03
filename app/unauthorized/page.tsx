import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-3xl font-bold mb-4">Ikke tilladt for dig</h1>
            <p>Du har ikke adgang til denne side.</p>
            <Link href="/" className="mt-4 text-blue-600 hover:underline">Gå til forside</Link>
        </div>
    );
}
