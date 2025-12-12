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
        userId: user.id,
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

    // UNRESERVE
if (isReserved) {
  const { error } = await supabase
    .from("reservation_list")
    .delete()
    .eq("event_id", event.id)
    .eq("user_id", user.id);

  if (!error) {
    await supabase.rpc("decrement_attendee", { event_id_input: event.id });
  }
}

// RESERVE
else {
  if (event.servings_left <= 0) return;

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

  if (error) {
    console.error("[ReserveButton] Insert failed:", error);
    return;
  }

  // Update attendee count + servings_left
  await supabase.rpc("increment_attendee", { event_id_input: event.id });

  await sendReservationEmail(user);
}

reserve(event.id);
  }

  const isReserved = reserves.includes(event.id);
  const isFull = event.servings_left <= 0 && !isReserved;
  const canInteract = !isFull;

  return (
    <Button
      type={!isFull && !isReserved ? "primary" : "default"}
      disabled={!canInteract}
      style={{
        backgroundColor: isReserved ? "#52c41a" : undefined,
        color: isReserved ? "#fff" : undefined,
        cursor: canInteract ? "pointer" : "not-allowed",
      }}
      icon={isReserved ? <CheckOutlined /> : null}
      onClick={(e) => {
        e.stopPropagation();
        if (canInteract) handleReserve();
      }}
    >
      {isFull ? "Event Full" : isReserved ? "Reserved" : "Reserve"}
    </Button>
  );
}
