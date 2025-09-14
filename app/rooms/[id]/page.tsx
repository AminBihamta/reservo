"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";

export default function RoomPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const [events, setEvents] = useState<any[]>([]);

    // ✅ Load bookings from DB when page loads
    useEffect(() => {
        async function fetchBookings() {
            const res = await fetch(`/api/bookings?roomId=${id}`);
            const data = await res.json();
            if (!data.error) {
                setEvents(
                    data.map((booking: any) => ({
                        id: booking.id,
                        title: booking.title || "Booking",
                        start: booking.start_time,
                        end: booking.end_time,
                        allDay: false,
                    }))
                );
            }
        }
        fetchBookings();
    }, [id]);

    async function handleDateSelect(selectInfo: any) {
        const title = prompt("Enter booking title (optional):");
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();

        const newEvent = {
            id: String(Date.now()), // temporary ID
            title: title || "Booking",
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay,
        };

        setEvents((prev) => [...prev, newEvent]); // update UI immediately

        // save to Supabase
        const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                roomId: id,
                start: newEvent.start,
                end: newEvent.end,
                status: "pending",
            }),
        });

        const data = await res.json();
        if (data.error) {
            alert("Error saving booking: " + data.error);
        } else {
            // ✅ Replace temp ID with DB ID
            setEvents((prev) =>
                prev.map((ev) =>
                    ev.id === newEvent.id ? { ...ev, id: data.id } : ev
                )
            );
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
                editable={true}
                eventDrop={(info) => {
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