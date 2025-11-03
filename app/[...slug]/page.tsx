import Link from "next/link";

export default function CatchAllPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold mb-2 text-red-600">Side kunne ikke findes...</h1>
        <Link
            href="/"
            className="text-black-600 hover:underline mt-4"
                >
                Gå til forside
        </Link>
    </div>
);
}
