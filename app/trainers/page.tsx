"use client";

import Link from "next/link";

export default function TrainersPage() {
    return ( <div className="p-6"> <h1 className="text-2xl font-bold mb-4">Velkommen, PersonalTrainer</h1> <p>Dette er din startside som træner.</p> <ul className="mt-4 space-y-2"> <li> <Link href="/trainers/clients" className="text-blue-600 font-semibold">
            Se dine klienter </Link> </li> <li> <Link href="/trainers/programs" className="text-blue-600 font-semibold">
            Se dine programmer </Link> </li> </ul> </div>
    );
}
