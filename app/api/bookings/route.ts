import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// POST = create booking
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

// GET = fetch bookings for a room
export async function GET(request: Request) {
  const supabase = createClient(cookies());
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("room_id", roomId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data); // ✅ always JSON
}