"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AddRoomForm({ onRoomAdded }: { onRoomAdded?: () => void }) {
    const [name, setName] = useState("");
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    async function handleAddRoom() {
        setLoading(true);

        const res = await fetch("/api/rooms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        });

        setLoading(false);
        setName("");

        router.refresh();
    }

    return (
        <div className='flex flex-row gap-2 mb-10'>
            <Input
                className="rounded-lg"
                placeholder='Room Name'
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <Button className="rounded-lg" onClick={handleAddRoom} disabled={isLoading || !name}>
                {isLoading ? "Adding..." : "Add Room"}
            </Button>
        </div>
    );
}
