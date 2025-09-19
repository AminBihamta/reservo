"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function RoomCalendar({ roomId, userId }: { roomId: string; userId: string }) {
    const supabase = createClient();
    const [events, setEvents] = useState<any[]>([]);

    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);

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

                // attach user info by querying profiles for all unique user_ids
                const userIds = Array.from(new Set((data || []).map((b: any) => b.user_id).filter(Boolean)));

                let profilesMap: Record<string, any> = {};
                if (userIds.length > 0) {
                    const { data: profiles } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds as any[]);
                    (profiles || []).forEach((p: any) => {
                        profilesMap[String(p.id)] = p;
                    });
                }

                const mapped = (data || []).map((b: any) => ({
                    id: String(b.id),
                    title: b.status ? (b.status === "pending" ? "Pending" : "Booked") : "Booking",
                    start: b.start_time,
                    end: b.end_time,
                    allDay: false,
                    extendedProps: {
                        status: b.status,
                        userId: b.user_id,
                        userName: profilesMap[String(b.user_id)]?.full_name || profilesMap[String(b.user_id)]?.email || null,
                        raw: b,
                    },
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
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();

        const newEvent: any = {
            id: String(Date.now()),
            title: "Pending",
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay,
            extendedProps: {
                status: "pending",
                userId: userId || null,
                userName: null,
            },
        };

        // try to fetch current user's profile name to show immediately
        if (userId) {
            try {
                const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", userId).single();
                if (profile) {
                    newEvent.extendedProps.userName = profile.full_name || profile.email || "You";
                } else {
                    newEvent.extendedProps.userName = "You";
                }
            } catch (e) {
                newEvent.extendedProps.userName = "You";
            }
        } else {
            newEvent.extendedProps.userName = null;
        }

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

    function handleEventClick(clickInfo: any) {
        const ev = clickInfo.event;
        const payload = {
            id: ev.id,

            title: ev.title,
            start: ev.startStr ?? ev.start?.toISOString(),
            end: ev.endStr ?? ev.end?.toISOString(),
            ...(ev.extendedProps || {}),
        };
        setSelectedBooking(payload);
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setSelectedBooking(null);
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Room {roomId} - Booking Calendar</h1>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                selectable={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                events={events}
                editable={true}
            />

            {showModal && selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0" onClick={closeModal} />
                    <div className="z-60 bg-neutral-900  rounded-lg shadow-lg p-6 max-w-md w-full mx-4 text-white">
                        <h2 className="text-lg font-semibold mb-2">{selectedBooking.title || "Booking"}</h2>
                        <p className="mb-1"><strong>Start:</strong> {new Date(selectedBooking.start).toLocaleString()}</p>
                        <p className="mb-1"><strong>End:</strong> {new Date(selectedBooking.end).toLocaleString()}</p>
                        {selectedBooking.status && <p className="mb-1"><strong>Status:</strong> {selectedBooking.status}</p>}
                        {selectedBooking.userName && <p className="mb-1"><strong>User:</strong> {selectedBooking.userName}</p>}
                        {selectedBooking.userId && <p className="mb-3 text-sm text-gray-300"><strong>User ID:</strong> {selectedBooking.userId}</p>}

                        <div className="flex justify-end">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}