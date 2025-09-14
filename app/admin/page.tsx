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
import { Button } from '@/components/ui/button';
import Image from 'next/image'



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
                    <p className='w-[300px] text-center'></p>
                </div>

                {rooms?.map((room) => (
                    <div key={room.id}>
                        <div className='flex flex-row min-w-full justify-between border p-2 align-middle items-center rounded-lg min-h-[50px]' >
                            <p className='w-[30%] text-center'>{room.id}</p>
                            <EditableRoomName roomId={room.id} initialName={room.name} />
                            <div className='w-[300px] text-center flex flex-row  gap-2 justify-end'>
                                <DeleteRoomButton roomId={room.id} />
                                <Link href={'/rooms/' + room.id}>
                                    <Button className="bg-neutral-900 border border-neutral-300 p-[10px] hover:bg-neutral-800">
                                        <Image className="fill-red-200" src="/view-icon.svg" width={18} height={25} alt={""} />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div >
    )
}
