import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RoomCalendar from "./RoomsCalendar"; // 👈 client component

export default async function RoomPage({ params }: { params: { id: string } }) {
    const supabase = createClient(cookies());
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }

    // fetch room to get its name
    const { data: roomData, error: roomError } = await supabase.from("rooms").select("id, name").eq("id", params.id).single();

    const roomName = roomData?.name ?? params.id;

    return <RoomCalendar roomId={params.id} userId={user.id} roomName={roomName} />;
}