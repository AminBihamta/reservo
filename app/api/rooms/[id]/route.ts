import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from 'next/headers'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = createClient(cookies());  
    const { id } = await params;
    const {error} = await supabase.from("rooms").delete().eq("id", id);

    if(error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
        return NextResponse.json({success: true});
    
}
