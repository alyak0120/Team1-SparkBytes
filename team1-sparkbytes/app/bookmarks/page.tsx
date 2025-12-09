"use client";
import { useEffect, useState } from "react";
import { Row, Col, Empty } from "antd";
import EventCard from "@/components/event-card";
import { createClient } from "@/lib/supabase/client";
import { ConfigProvider, theme } from "antd";


export default function BookmarksPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [reserves, setReserves] = useState<number[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const loadBookmarks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch bookmarks
      const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("event_id")
        .eq("user_id", user.id);

      if (!bookmarks?.length) {
        setEvents([]);
        return;
      }

      const eventIds = bookmarks.map((b) => b.event_id);

      // Fetch actual events
      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .in("id", eventIds);

      if (!eventData) {
        setEvents([]);
        return;
      }

      // Apply same formatting as home page (preparedEvents)
      const formatted = eventData.map((e: any) => {
        const start = new Date(e.start_time);
        const end = new Date(e.end_time);

        const dateStr = `${start.getMonth() + 1}/${start.getDate()}`;
        const startTimeStr = start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        const endTimeStr = end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

        return {
          ...e,
          time: `${dateStr} | ${startTimeStr} - ${endTimeStr}`,
          servingsLeft: e.capacity,
          image: e.image_url || "/images/default.jpg",
        };
      });

      setEvents(formatted);
    };

    loadBookmarks();
  }, []);

  // Dummy versions so card renders exactly like homepage
  const favs = (id: number) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const reserve = (id: number) =>
    setReserves((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));

  return (
    <ConfigProvider
    theme={{
      algorithm: theme.defaultAlgorithm,
      token: { colorPrimary: "#CC0000" }
    }}>
    <Row gutter={[16, 16]} style={{ padding: 20 }}>
      {events.length === 0 ? (
        <Empty description="No bookmarks yet" />
      ) : (
        events.map((event) => (
          <Col key={event.id} xs={24} sm={12} md={8} lg={6}>
            <EventCard
              event={event}
              favorites={favorites}
              favs={favs}
              reserves={reserves}
              reserve={reserve}
            />
          </Col>
        ))
      )}
    </Row>
    </ConfigProvider>
  );
}

