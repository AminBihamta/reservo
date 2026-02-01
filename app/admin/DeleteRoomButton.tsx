"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from 'next/image'


export default function DeleteRoomButton({ roomId }: { roomId: string }) {
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    async function handleDeleteRoom() {
        setLoading(true);

        await fetch('/api/rooms/' + roomId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        setLoading(false);
        router.refresh();
    }

    return (
        <Button variant="destructive" className="bg-red-950 border border-red-500 p-[12px] hover:bg-red-900"
            onClick={handleDeleteRoom} disabled={isLoading}>
            <Image className="fill-red-200" src="/trash-icon.svg" width={15} height={15} alt={""} />
        </Button>

    )
};
