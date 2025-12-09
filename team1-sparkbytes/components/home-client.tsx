"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Space, Tooltip, ConfigProvider, theme, Button, Drawer, Menu, Row, Col, Card } from 'antd';
import { PlusOutlined, MenuOutlined, UserOutlined, BookOutlined, FlagOutlined } from '@ant-design/icons';
import dynamic from "next/dynamic";
import SearchBar from "@/components/search-bar";
import Filters from "@/components/filters";
import EventList from "@/components/event-list";

const Map = dynamic(() => import('@/components/map'), { ssr: false });

const defaults = { Other: "/images/default.jpg" };

const mockEvents = [
  {
    id: 1,
    title: "Pizza Night",
    description: "Join us for free pizza slices and good vibes!",
    location: "GSU",
    campus: "Central Campus",
    capacity: 50,
    attendee_count: 0,
    start_time: "2024-10-10T18:00:00Z",
    end_time: "2024-10-10T20:00:00Z",
    dietary_tags: ["Vegetarian"],
    allergy_tags: ["Dairy-Free", "Gluten-Free"],
    image_url: "/images/pizza.jpg"
  },
  {
    id: 2,
    title: "Taco Tuesday",
    description: "Spicy tacos and fun games!",
    location: "Warren Towers Common Room",
    campus: "East Campus",
    capacity: 40,
    attendee_count: 0,
    start_time: "2024-10-15T18:00:00Z",
    end_time: "2024-10-15T20:00:00Z",
    dietary_tags: ["Halal"],
    allergy_tags: ["Gluten-Free"],
    image_url: "/images/tacos.jpg"
  }
];

const sortOptions = [
  { value: "time", label: "Newest" },
  { value: "servings", label: "Servings Left" }
];
const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher", "Pescatarian"];
const allergyOptions = ["Nut-Free", "Dairy-Free", "Soy-Free", "Gluten-Free", "Shellfish-Free"];
const locationOptions = ["East", "West", "South", "Central", "Fenway"];

export default function Home() {
  const router = useRouter();
  const [events, setEvents] = useState(mockEvents);
  const [layout, setLayout] = useState<'map' | 'list'>('list');
  const [sort, setSort] = useState<"time" | "servings">("time");
  const [reserves, setReserves] = useState<number[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [allergy, setAllergy] = useState<string[]>([]);
  const [location, setLocation] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch Supabase events + live updates
  useEffect(()=> {
    const supabase = createClient();

    async function fetchEvents() {
      const { data, error } = await supabase.from('events').select('*').order('id', { ascending: false });
      if (error) console.error("Supabase fetch error:", error);
      else if (data) {
      const fetchedEvents = data.map((e: any) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        location: e.location,
        campus: e.campus,
        capacity: e.capacity,
        attendee_count: e.attendee_count || 0,
        start_time: e.start_time, // must exist
        end_time: e.end_time,     // must exist
        dietary_tags: e.dietary_tags || [],
        allergy_tags: e.allergy_tags || [],
        image_url: e.image_url || defaults.Other
      }));
      setEvents([...fetchedEvents]);
      }
    }

    fetchEvents();

    const subscription = supabase
      .channel('public:events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, payload => {
        if (payload.eventType === 'INSERT') {
          const newEvent = payload.new;
          setEvents(prev => [
          ...prev,
          {
            id: newEvent.id,
            title: newEvent.title,
            description: newEvent.description,
            location: newEvent.location,
            campus: newEvent.campus,
            capacity: newEvent.capacity,
            attendee_count: newEvent.attendee_count || 0,
            start_time: newEvent.start_time,
            end_time: newEvent.end_time,
            dietary_tags: newEvent.dietary_tags || [],
            allergy_tags: newEvent.allergy_tags || [],
            image_url: newEvent.image_url || defaults.Other
          }
        ]);

        }
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const filteredEvents = events
    .filter(e => dietary.length === 0 || dietary.every(d => e.dietary_tags.includes(d)))
    .filter(e => allergy.length === 0 || allergy.every(a => !e.allergy_tags.includes(a)))
    .filter(e => location.length === 0 || location.includes(e.campus))
    .filter(e =>
      (e.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (e.description?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (e.location?.toLowerCase() || "").includes(search.toLowerCase())
    )
    .sort((a, b) => {
    if (sort === "time") {
      // Newest first
      return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
    } else {
      // Servings left descending
      return b.capacity - a.capacity;    
    }
  });

  const preparedEvents = filteredEvents.map(e => {
  const start = new Date(e.start_time);
  const end = new Date(e.end_time);

  // Format date as MM/DD
  const dateStr = `${start.getMonth() + 1}/${start.getDate()}`;

  // Format times as h:mm AM/PM
  const startTimeStr = start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const endTimeStr = end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return {
    ...e,
    time: `${dateStr} | ${startTimeStr} - ${endTimeStr}`, // final display
    servingsLeft: e.capacity, // remaining spots
    image: e.image_url || defaults.Other,
  };
  });


  const reserve = (id: number) =>
    setReserves(prev => (prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]));

  useEffect(() => {
    const supabase = createClient();
    console.log("Fetching reservations!");
    const fetchReservations = async () => {
      const userReserves = [];
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
        return null;
      }

      if (user) {
        console.log('Fetching reservations with user:', user);
        const { data, error } = await supabase
        .from('reservations').select('event_id').eq('user_id', user.id);
        if (error) {
            console.error("Error fetching user's reservations: ", error.message);
        } else {
          for (let i = 0; i < data.length; i++) {
            userReserves.push(data[i].event_id);
          }
          setReserves(userReserves);
          console.log(userReserves);
        }
      } else {
        console.log('No user is currently logged in.');
        return null;
      }
    }
  fetchReservations();
  }, []);

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: { colorPrimary: "#CC0000", borderRadius: 12, colorBgContainer: "#fff" }
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%", padding: "24px 32px" }}>

          {/* Header row (hamburger + search bar) */}
          <Space style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            
            <Space size="small">
            <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerOpen(true)} />
                    {/* Filters */}
          <Filters
            layout={layout}
            sort={sort}
            setSort={setSort}
            sortOptions={sortOptions}
            dietaryOptions={dietaryOptions}
            dietary={dietary}
            setDietary={setDietary}
            allergyOptions={allergyOptions}
            allergy={allergy}
            setAllergy={setAllergy}
            locationOptions={locationOptions}
            location={location}
            setLocation={setLocation}
          />
          </Space>

          <Space size="small">
          <SearchBar layout={layout} setLayout={setLayout} search={search} setSearch={setSearch} />
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

        {/* Event cards */}
          {layout === "list" && filteredEvents?.length ? (
            <EventList
              filteredEvents={preparedEvents}
              reserves={reserves}
              reserve={reserve}
              defaults={defaults}
            />
          ) : layout === "list" ? (
            <p>No events found.</p>
          ) : (
            <Map />
          )}
        </Space>

        {/* Sidebar Drawer */}
        <Drawer title="Menu" placement="left" onClose={() => setDrawerOpen(false)} open={drawerOpen}>
          <Menu
            mode="inline"
            items={[
              { key: "account", icon: <UserOutlined />, label: "My Account", onClick: () => router.push("/dashboard") },
              { key: "bookmarks", icon: <BookOutlined />, label: "Bookmarks", onClick: () => router.push("/bookmarks") },
              { key: "report", icon: <FlagOutlined />, label: "Report a Problem", onClick: () => router.push("/report") }
            ]}
          />
        </Drawer>
      </ConfigProvider>

      {/* Floating post button */}
      <div style={{ position: "fixed", bottom: "120px", right: "40px", zIndex: 2000 }}>
        <Tooltip title="Post a new event">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<PlusOutlined className="plus-icon" />}
            className="floating-post-button"
            onClick={() => router.push("/post")}
          />
        </Tooltip>
      </div>
    </>
  );
}
