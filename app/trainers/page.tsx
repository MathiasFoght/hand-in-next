import { fetchTrainers } from "@/app/api/dataFetching";

export default async function TrainersPage() {
    const trainers = await fetchTrainers();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">All Trainers</h1>
            {trainers.length === 0 ? (
                <p>No trainers found.</p>
            ) : (
                <ul className="space-y-2">
                    {trainers.map((trainer) => (
                        <li key={trainer.userId} className="border p-4 rounded">
                            <p className="font-semibold">
                                {trainer.firstName} {trainer.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{trainer.email}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
