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

    return <RoomCalendar roomId={params.id} userId={user.id} />;
}