import React from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server';


export default async function AdminPage() {
    const supabase = createClient(cookies());
    const { data: rooms } = await supabase.from("rooms").select();
    return <pre>{JSON.stringify(rooms, null, 2)}</pre>
    // return (
    //     <div>

    //     </div>
    // )
}

