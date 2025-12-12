"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Space,
  Tooltip,
  ConfigProvider,
  theme,
  Button,
  Drawer,
  Menu
} from "antd";
import {
  PlusOutlined,
  MenuOutlined,
  UserOutlined,
  BookOutlined,
  FlagOutlined
} from "@ant-design/icons";
import dynamic from "next/dynamic";

import SearchBar from "@/components/search-bar";
import Filters from "@/components/filters";
import EventList from "@/components/event-list";
import EventModal from "@/components/event-modal";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

// Default images for events without specific images //
const defaults = { Other: "/images/default.jpg" };

// Filter option arrays
const sortOptions = [
  { value: "time", label: "Newest" },
  { value: "servings", label: "Servings Left" }
];

const dietaryOptions = [
  "Vegetarian", "Vegan", "Gluten-Free",
  "Halal", "Kosher", "Pescatarian"
];

const allergyOptions = [
  "Nut-Free", "Dairy-Free", "Soy-Free",
  "Gluten-Free", "Shellfish-Free"
];

const locationOptions = ["East", "West", "South", "Central", "Fenway"];

export default function Home() {
  // State variables //
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [layout, setLayout] = useState<"map" | "list">("list");
  const [sort, setSort] = useState<"time" | "servings">("time");
  const [reserves, setReserves] = useState<number[]>([]);

  const [dietary, setDietary] = useState<string[]>([]);
  const [allergy, setAllergy] = useState<string[]>([]);
  const [location, setLocation] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const onOpenModal = (event: any) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  // Fetch events + live updates
  useEffect(() => {
    const supabase = createClient();

    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Supabase fetch error:", error);
        return;
      }

      if (data) {
        const mapped = data.map((e: any) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          location: e.location,
          campus: e.campus,
          capacity: e.capacity,
          attendee_count: e.attendee_count ?? 0,
          servings_left: e.servings_left, // ⭐ NEW — use DB-calculated column
          start_time: e.start_time,
          end_time: e.end_time,
          dietary_tags: e.dietary_tags || [],
          allergy_tags: e.allergy_tags || [],
          image_url: e.image_url || defaults.Other
        }));

        setEvents(mapped);
      }
    }

    fetchEvents();

    // Subscribe for realtime event updates
    // Subscribe for realtime event updates
// Subscribe for realtime event updates
const subscription = supabase
  .channel("public:events")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "events" },
    (payload: any) => {
      const updatedEvent = payload.new as any;

      setEvents((prev: any[]) =>
        prev.map((ev: any) =>
          ev.id === updatedEvent.id
            ? {
                ...ev,
                ...updatedEvent, // includes servings_left, attendee_count, etc.
              }
            : ev
        )
      );
    }
  )
  .subscribe();




    return () => supabase.removeChannel(subscription);
  }, []);

  // Filters + sorting
  const filteredEvents = events
    .filter(e => dietary.length === 0 || dietary.every(d => e.dietary_tags.includes(d)))
    .filter(e => allergy.length === 0 || allergy.every(a => !e.allergy_tags.includes(a)))
    .filter(e => location.length === 0 || location.includes(e.campus))
    .filter(e =>
      (e.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.location || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "time") {
        return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
      }
      return (b.servings_left ?? 0) - (a.servings_left ?? 0);
    });

  // Format event times
  const preparedEvents = filteredEvents.map(e => {
    const start = new Date(e.start_time);
    const end = new Date(e.end_time);

    return {
      ...e,
      time: `${start.getMonth() + 1}/${start.getDate()} | ${
        start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      } - ${
        end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      }`,
      image: e.image_url || defaults.Other
    };
  });

  // User reservation toggling (local only)
  const reserve = (id: number) =>
    setReserves(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );

  // Load user's existing reservations
  useEffect(() => {
    const supabase = createClient();

    async function fetchReservations() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("reservation_list")
        .select("event_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching reservations:", error.message);
        return;
      }

      setReserves(data.map((r: any) => r.event_id));
    }

    fetchReservations();
  }, []);

  return (
    <>
      {/* THEME CONFIG */}
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: "#CC0000",
            borderRadius: 12,
            colorBgContainer: "#fff"
          }
        }}
      >
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", padding: "24px 32px" }}
        >
          {/* Header */}
          <Space
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            {/* Left side */}
            <Space size="small">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
              />

              <Filters
                layout={layout}
                sort={sort}
                setSort={setSort}
                sortOptions={sortOptions}
                dietary={dietary}
                setDietary={setDietary}
                dietaryOptions={dietaryOptions}
                allergy={allergy}
                setAllergy={setAllergy}
                allergyOptions={allergyOptions}
                location={location}
                setLocation={setLocation}
                locationOptions={locationOptions}
              />
            </Space>

            {/* Right side */}
            <Space size="small">
              <SearchBar
                layout={layout}
                setLayout={setLayout}
                search={search}
                setSearch={setSearch}
              />

              <Button
                type={sort === "servings" ? "primary" : "default"}
                onClick={() => setSort("servings")}
              >
                Servings Left
              </Button>

              <Button
                type={sort === "time" ? "primary" : "default"}
                onClick={() => setSort("time")}
              >
                Newest
              </Button>
            </Space>
          </Space>

          {/* Event List */}
          {layout === "list" && preparedEvents.length ? (
            <EventList
              filteredEvents={preparedEvents}
              reserves={reserves}
              reserve={reserve}
              defaults={defaults}
              onOpenModal={onOpenModal}
            />
          ) : layout === "list" ? (
            <p>No events found.</p>
          ) : (
            <Map />
          )}
        </Space>

        {/* Sidebar Drawer */}
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
        >
          <Menu
            mode="inline"
            items={[
              {
                key: "account",
                icon: <UserOutlined />,
                label: "My Account",
                onClick: () => router.push("/dashboard")
              },
              {
                key: "bookmarks",
                icon: <BookOutlined />,
                label: "Bookmarks",
                onClick: () => router.push("/bookmarks")
              },
              {
                key: "report",
                icon: <FlagOutlined />,
                label: "Report a Problem",
                onClick: () => router.push("/report")
              }
            ]}
          />
        </Drawer>
      </ConfigProvider>

      {/* Floating Post Button */}
      <div
        style={{
          position: "fixed",
          bottom: "120px",
          right: "40px",
          zIndex: 2000
        }}
      >
        <Tooltip title="Post a new event">
          <Button
            className="floating-post-button"
            shape="circle"
            size="large"
            icon={<PlusOutlined className="plus-icon" />}
            onClick={() => router.push("/post")}
          />
        </Tooltip>
      </div>
      <EventModal
        event={selectedEvent}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
