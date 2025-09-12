"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";

export default function RoomPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const [events, setEvents] = useState<any[]>([]);

    function handleDateSelect(selectInfo: any) {
        let title = prompt("Enter booking title:");
        let calendarApi = selectInfo.view.calendar;
        calendarApi.unselect(); // clear highlight

        if (title) {
            const newEvent = {
                id: String(Date.now()),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
            };

            setEvents([...events, newEvent]);

            // TODO: Save to Supabase
            fetch(`/api/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomId: id, ...newEvent }),
            });
        }
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