"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RoomCalendar({ roomId, userId }: { roomId: string; userId: string }) {
    const supabase = createClient();
    const [events, setEvents] = useState<any[]>([]);

    // Fetch existing bookings for this room and map them into FullCalendar events
    useEffect(() => {
        if (!roomId) return;

        let mounted = true;

        async function fetchBookings() {
            try {
                const res = await fetch(`/api/bookings?roomId=${encodeURIComponent(roomId)}`);
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    console.error("Failed to fetch bookings", err);
                    return;
                }

                const data = await res.json();

                if (!mounted) return;

                const mapped = (data || []).map((b: any) => ({
                    id: String(b.id),
                    title: b.status ? (b.status === "pending" ? "Pending" : "Booked") : "Booking",
                    start: b.start_time,
                    end: b.end_time,
                    allDay: false,
                }));

                setEvents(mapped);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        }

        fetchBookings();

        return () => {
            mounted = false;
        };
    }, [roomId]);

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

    // use functional update to avoid stale closure
    setEvents((prev) => [...prev, newEvent]);

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