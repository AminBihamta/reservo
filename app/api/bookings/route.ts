import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const supabase = createClient(cookies());
  const data = await request.json();

  const { roomId, start, end, userId, status = "pending" } = data;

  const { error } = await supabase.from("bookings").insert([
    {
      room_id: roomId,
      user_id: userId || null,
      start_time: start,
      end_time: end,
      status,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}