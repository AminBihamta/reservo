"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RoomCalendar({ roomId, userId }: { roomId: string; userId: string }) {
    const supabase = createClient();
    const [events, setEvents] = useState<any[]>([]);

    async function handleDateSelect(selectInfo: any) {
        const title = prompt("Enter booking title (optional):");
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();

        const newEvent = {
            id: String(Date.now()),
            title: title || "Booking",
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay,
        };

        setEvents([...events, newEvent]);

        // ✅ Save booking with server-known userId
        const { error } = await supabase.from("bookings").insert([
            {
                room_id: roomId,
                user_id: userId, // 👈 passed from server
                start_time: newEvent.start,
                end_time: newEvent.end,
                status: "pending",
            },
        ]);

        if (error) {
            alert("Error saving booking: " + error.message);
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Room {roomId} - Booking Calendar</h1>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                selectable={true}
                select={handleDateSelect}
                events={events}
                editable={true}
            />
        </div>
    );
}