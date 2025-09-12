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
        <div className='flex flex-col min-w-screen'>
            <AddRoomForm />
            <div className='flex flex-col gap-4 min-w-full'>
                <div className='flex flex-row min-w-full justify-between'>
                    <p className='w-[30%] text-center'>Room Id</p>
                    <p className='w-[30%] text-center'>Room Name</p>
                    <p className='w-[300px] text-center'>Actions Name</p>
                </div>

                {rooms?.map((room) => (
                    <div className='flex flex-row min-w-full justify-between' key={room.id}>
                        <p className='w-[30%] text-center'>{room.id}</p>
                        <p className='w-[30%] text-center'>{room.name}</p>
                        <div className='w-[300px] text-center'><DeleteRoomButton roomId={room.id} /></div>
                    </div>
                ))}
            </div>

        </div>
    )
}
