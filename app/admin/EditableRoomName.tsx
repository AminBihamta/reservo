"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function EditableRoomName({ roomId, initialName }: { roomId: string, initialName: string }) {
    const [isEditing, setEditing] = useState(false);
    const [name, setName] = useState(initialName);
    const router = useRouter();

    async function saveName() {
        await fetch('/api/rooms/' + roomId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        setEditing(false);
        router.refresh();
    }

    return (
        <div>
            {
                isEditing ? (
                    <Input
                        className="text-center"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onBlur={saveName}
                        onKeyDown={(e) => e.key === 'Enter' && saveName()}
                        autoFocus />
                ) : (
                    <p
                        onClick={() => setEditing(true)}
                        className="cursor-pointer hover:underline"
                    >
                        {name}
                    </p>
                )
            }
        </div>
    );
}