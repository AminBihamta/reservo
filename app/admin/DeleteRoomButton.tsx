"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DeleteRoomButton({ roomId }: { roomId: string }) {
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    async function handleDeleteRoom() {
        setLoading(true);

        const res = await fetch('/api/rooms/' + roomId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        setLoading(false);
        router.refresh();
    }

    return (
        <Button variant="destructive" onClick={handleDeleteRoom} disabled={isLoading}>{isLoading ? 'Loading...' : 'Delete Room'}</Button>
    )
};