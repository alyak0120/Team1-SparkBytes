"use client";

import { Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function ReserveButton({ event, reserves, reserve }: any) {
  async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async function sendReservationEmail(user: any) {
    await fetch("/api/email/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        eventTitle: event.title,
        eventTime: event.time,
        location: event.location,
      }),
    });
  }

  async function handleReserve() {
    const user = await getCurrentUser();
    if (!user) {
      alert("You must be logged in to reserve.");
      return;
    }

    const isReserved = reserves.includes(event.id);

    // ❌ UNRESERVE
    if (isReserved) {
      const { error } = await supabase
        .from("reservation_list")
        .delete()
        .eq("event_id", event.id)
        .eq("user_id", user.id);

      if (!error) {
        // decrement attendee count
        await supabase.rpc("decrement_attendee", { event_id_input: event.id });
      }
    }

    // ✅ RESERVE
    else {
      if (event.servings_left <= 0) return; // prevent over-reserving

      const { error } = await supabase
        .from("reservation_list")
        .insert([
          {
            event_id: event.id,
            event_title: event.title,
            user_id: user.id,
            user_email: user.email,
          },
        ]);

      if (!error) {
        // increment attendee count (servings_left auto recalculated)
        await supabase.rpc("increment_attendee", { event_id_input: event.id });
        sendReservationEmail(user);
      }
    }

    reserve(event.id);
  }

  const isReserved = reserves.includes(event.id);
  const isFull = event.servings_left <= 0 && !isReserved;

  return (
    <Button
      type={!isFull && !isReserved ? "primary" : "default"}
      disabled={isFull && !isReserved}
      style={{
        backgroundColor: isReserved ? "#52c41a" : undefined,
        color: isReserved ? "#fff" : undefined,
        cursor: isFull ? "not-allowed" : "pointer",
      }}
      icon={isReserved ? <CheckOutlined /> : null}
      onClick={isFull ? undefined : handleReserve}
    >
      {isFull ? "Event Full" : isReserved ? "Reserved" : "Reserve"}
    </Button>
  );
}
