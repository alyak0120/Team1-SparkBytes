"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Row, Col, Empty, Spin } from "antd";
import EventCard from "@/components/event-card";

const supabase = createClient();

interface ReservedEvent {
  id: number;
  title: string;
  description: string;
  location: string;
  campus: string;
  start_time: string;
  end_time: string;
  servings_left: number;
  capacity: number;
  attendee_count: number;
  dietary_tags?: string[];
  image_url?: string;
}

export default function ReservedEvents({ userId }: { userId: string }) {
  const [reservedEvents, setReservedEvents] = useState<ReservedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [reserved, setReserved] = useState<number[]>([]);

  async function fetchReservedEvents() {
    setLoading(true);
    try {
      // Fetch reservation_list entries for this user
      const { data: reservations, error: reservationError } = await supabase
        .from("reservation_list")
        .select("event_id")
        .eq("user_id", userId);

      if (reservationError) {
        console.error("Error fetching reservations:", reservationError);
        setLoading(false);
        return;
      }

      if (!reservations || reservations.length === 0) {
        setReservedEvents([]);
        setReserved([]);
        setLoading(false);
        return;
      }

      // Fetch event details for all reserved events
      const eventIds = reservations.map((r) => r.event_id);
      const { data: events, error: eventError } = await supabase
        .from("events")
        .select("*")
        .in("id", eventIds);

      if (eventError) {
        console.error("Error fetching event details:", eventError);
        setLoading(false);
        return;
      }

      setReservedEvents(events || []);
      setReserved(eventIds); // Mark all as reserved
    } catch (error) {
      console.error("Error in fetchReservedEvents:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReservedEvents();

    // Subscribe to real-time updates on reservation_list table
    const reservationSubscription = supabase
      .channel(`reservation-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reservation_list",
        },
        (payload: any) => {
          console.log("[ReservedEvents] Reservation change detected:", payload);
          // Refetch reserved events when any change occurs
          fetchReservedEvents();
        }
      )
      .subscribe((status) => {
        console.log(`[ReservedEvents] Reservation subscription status: ${status}`);
      });

    // Subscribe to real-time updates on events table
    const eventsSubscription = supabase
      .channel(`events-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (payload: any) => {
          console.log("[ReservedEvents] Event change detected:", payload);
          const updatedEvent = payload.new as any;
          setReservedEvents((prev: ReservedEvent[]) =>
            prev.map((e: ReservedEvent) =>
              e.id === updatedEvent.id
                ? {
                    ...e,
                    servings_left: updatedEvent.servings_left,
                    attendee_count: updatedEvent.attendee_count,
                    capacity: updatedEvent.capacity,
                  }
                : e
            )
          );
        }
      )
      .subscribe((status) => {
        console.log(`[ReservedEvents] Events subscription status: ${status}`);
      });

    return () => {
      supabase.removeChannel(reservationSubscription);
      supabase.removeChannel(eventsSubscription);
    };
  }, [userId]);

  const reserve = (id: number) => {
    setReserved((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spin />
      </div>
    );
  }

  if (reservedEvents.length === 0) {
    return <Empty description="No reserved events" />;
  }

  // Format events for display (same as home-client)
  const formattedEvents = reservedEvents.map((e: ReservedEvent) => {
    const start = new Date(e.start_time);
    const end = new Date(e.end_time);

    return {
      ...e,
      time: `${start.getMonth() + 1}/${start.getDate()} | ${start.toLocaleTimeString(
        [],
        { hour: "numeric", minute: "2-digit" }
      )} - ${end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
      image: e.image_url || "/images/default.jpg",
    };
  });

  return (
    <div style={{ marginTop: 12 }}>
      <Row gutter={[24, 24]} justify="start" align="stretch">
        {formattedEvents.length === 0 ? (
          <Empty description="No reserved events" />
        ) : (
          formattedEvents.map((event: any) => (
            <Col key={event.id} xs={24} sm={12} md={8} lg={6}>
              <EventCard
                event={event}
                reserves={reserved}
                reserve={reserve}
              />
            </Col>
          ))
        )}
      </Row>
    </div>
  );
}

