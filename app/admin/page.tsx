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
import EditableRoomName from './EditableRoomName';
import Link from 'next/link';



export default async function AdminPage() {
    const supabase = createClient(cookies());
    const { data: rooms } = await supabase.from("rooms").select();
    return (
        <div className='flex flex-col min-w-screen'>
            <AddRoomForm />
            <div className='flex flex-col gap-4 min-w-full'>
                <div className='flex flex-row min-w-full justify-between border p-2 items-center min-h-[50px] rounded-lg'>
                    <p className='w-[30%] text-center'>Room Id</p>
                    <p className='w-[30%] text-center'>Room Name</p>
                    <p className='w-[300px] text-center'>Actions Name</p>
                </div>

                {rooms?.map((room) => (
                    <Link href={'/rooms/' + room.id} key={room.id}>
                        <div className='flex flex-row min-w-full justify-between border p-2 align-middle items-center rounded-lg min-h-[50px]' >
                            <p className='w-[30%] text-center'>{room.id}</p>
                            <EditableRoomName roomId={room.id} initialName={room.name} />
                            <div className='w-[300px] text-center'><DeleteRoomButton roomId={room.id} /></div>
                        </div>
                    </Link>
                ))}
            </div>

        </div >
    )
}
