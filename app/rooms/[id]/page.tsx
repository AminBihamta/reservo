import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RoomCalendar from "./RoomsCalendar"; // 👈 client component

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = createClient(cookies());
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }

    // fetch room to get its name
    const { data: roomData } = await supabase.from("rooms").select("id, name").eq("id", id).single();

    const roomName = roomData?.name ?? id;

    return <RoomCalendar roomId={id} userId={user.id} roomName={roomName} />;
}
