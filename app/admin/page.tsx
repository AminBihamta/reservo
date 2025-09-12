import React from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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




export default async function AdminPage() {
    const supabase = createClient(cookies());
    const { data: rooms } = await supabase.from("rooms").select();
    return (
        <div>
            <AddRoomForm />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Room Id</TableHead>
                        <TableHead>Room Name</TableHead>
                    </TableRow>

                </TableHeader>
                <TableBody>
                    {rooms?.map((room) => (
                        <TableRow key={room.id}>
                            <TableCell>{room.id}</TableCell>
                            <TableCell>{room.name}</TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </div>
    )
}
