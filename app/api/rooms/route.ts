import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from 'next/headers'


export async function POST(request: Request) {
    const { name } = await request.json();
    const supabase = createClient(cookies());
    const { data, error } = await supabase.from("rooms").insert([{ name }]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Room not created" }, { status: 500 });
    return NextResponse.json({ room: data });
}
