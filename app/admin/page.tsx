import React from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import AddRoomForm from './AddRoomForm'
import DeleteRoomButton from './DeleteRoomButton'




export default async function AdminPage() {
    const supabase = createClient(cookies());
    const { data: rooms } = await supabase.from("rooms").select();
    return (
        <div>
            <AddRoomForm />
            <div className='flex flex-col gap-4'>
                <div>
                    <p>Room Id</p>
                    <p>Room Name</p>
                </div>

                {rooms?.map((room) => (
                    <div key={room.id}>
                        <p>{room.id}</p>
                        <p>{room.name}</p>
                        <DeleteRoomButton roomId={room.id} />
                    </div>
                ))}
            </div>

        </div>
    )
}
