"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";

export default function RoomPage({ params }: { params: { id: string } }) {
    const { id } = params;
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

        // save to Supabase
        const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                roomId: id,
                start: newEvent.start,
                end: newEvent.end,
                status: "pending",
                // optionally, userId if you have auth
            }),
        });

        const data = await res.json();
        if (data.error) alert("Error saving booking: " + data.error);
    }
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Room {id} - Booking Calendar</h1>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                selectable={true}
                select={handleDateSelect}
                events={events}
                editable={true} // allow drag & drop
                eventDrop={(info) => {
                    // update event timing after drag/drop
                    fetch(`/api/bookings/${info.event.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            start: info.event.start,
                            end: info.event.end,
                        }),
                    });
                }}
            />
        </div>
    );
}