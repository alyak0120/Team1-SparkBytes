"use client";

import { useEffect, useRef, useState } from "react";
import {
  Button,
  Layout,
  Divider,
  Image,
  Input,
  Switch,
  Card,
  message,
} from "antd";

import {
  EditOutlined,
  SaveOutlined,
  BellFilled,
  BellOutlined,
} from "@ant-design/icons";

import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";

import profile_img from "../../public/images/profile_img.png";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function DashboardPage() {
  const notificationRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);

  // Profile fields
  const [name, setName] = useState("");
  const [buId, setBuId] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null);

  // Data sections
  const [reservations, setReservations] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [eventsPosted, setEventsPosted] = useState<any[]>([]);

  // ============================================================
  // Mini Event Card Renderer
  // ============================================================
  function MiniEventCard({ event }: any) {
  if (!event) return null;

  const dateObj = event.start_time ? new Date(event.start_time) : null;

  const dateStr = dateObj
    ? dateObj.toLocaleDateString([], { month: "short", day: "numeric" })
    : "Date TBD";

  const timeStr = dateObj
    ? dateObj.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : "Time TBD";

  return (
    <div
      onClick={() => (window.location.href = `/event?id=${event.id}`)}
      style={{
        padding: "12px 14px",
        border: "2px solid #FFB3A6",
        borderRadius: 12,
        marginBottom: 12,
        cursor: "pointer",
        background: "white",
        transition: "0.2s",
        display: "flex",
        gap: 12,
        alignItems: "center",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#FFF1EC")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
    >
      {/* CUTE SPARKBYTES ICON */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: "#FF7043",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: 22,
        }}
      >
        🍽️
      </div>

      {/* EVENT INFO */}
      <div>
        <strong style={{ fontSize: 16, color: "#CC0000" }}>
          {event.title}
        </strong>

        <div style={{ fontSize: 13, color: "#333" }}>
          📅 {dateStr} — ⏰ {timeStr}
        </div>

        <div style={{ fontSize: 13, color: "#555" }}>
          📍 {event.location || "Location TBA"}
        </div>
      </div>
    </div>
  );
}


  // ============================================================
  // Load User + Profile
  // ============================================================
  async function loadUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return;

    setUser(data.user);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profile) {
      setName(profile.name || "");
      setBuId(profile.bu_id || "");
      setEmailNotifications(profile.email_notifications_enabled || false);
      setImageURL(profile.image_url || null);
    }
  }

  // ============================================================
  // Upload Profile Image
  // ============================================================
  async function uploadProfileImage(e: any) {
    if (!user) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const filePath = `profiles/${user.id}-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      message.error("Failed to upload image.");
      return;
    }

    const { data: publicURL } = supabase.storage
      .from("event-images")
      .getPublicUrl(filePath);

    if (publicURL?.publicUrl) {
      setImageURL(publicURL.publicUrl);

      await supabase
        .from("profiles")
        .update({ image_url: publicURL.publicUrl })
        .eq("id", user.id);

      message.success("Profile image updated!");
    }
  }

  // ============================================================
  // Save Profile
  // ============================================================
  async function saveChanges() {
    if (!user) return;

    await supabase
      .from("profiles")
      .update({
        name,
        bu_id: buId,
        email_notifications_enabled: emailNotifications,
      })
      .eq("id", user.id);

    message.success("Profile updated!");
    setEditing(false);
  }

  // ============================================================
  // Toggle Notifications
  // ============================================================
  async function toggleNotifications(enabled: boolean) {
    setEmailNotifications(enabled);
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ email_notifications_enabled: enabled })
      .eq("id", user.id);

    message.success(enabled ? "Notifications Enabled" : "Notifications Disabled");
  }

  // ============================================================
  // Load Reservations (Full Event Objects)
  // ============================================================
  async function loadReservations() {
  if (!user) return;

  const { data, error } = await supabase
    .from("reservation_list")
    .select("events (*)")
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to load reservations:", error);
    return;
  }

  const events = data
    .map((row) => row.events)
    .filter(Boolean);

  setReservations(events);
}


  // ============================================================
  // Load Bookmarks (Full Event Objects)
  // ============================================================
  async function loadBookmarks() {
    if (!user) return;

    const { data: rows } = await supabase
      .from("bookmarks")
      .select("event_id")
      .eq("user_id", user.id);

    if (!rows || rows.length === 0) return setBookmarks([]);

    const eventIds = rows.map((b) => b.event_id);

    const { data: events } = await supabase
      .from("events")
      .select("*")
      .in("id", eventIds);

    setBookmarks(events || []);
  }

  // ============================================================
  // Load Events User Posted
  // ============================================================
  async function loadEventsPosted() {
    if (!user) return;

    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("created_by", user.id);

    setEventsPosted(data || []);
  }

  // ============================================================
  // On Mount
  // ============================================================
  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadBookmarks();
      loadReservations();
      loadEventsPosted();
    }
  }, [user]);

  // ============================================================
  // Render Layout
  // ============================================================
  return (
    <Layout style={{ minHeight: "100vh", background: "#FFF8F5" }}>
      <div style={{ display: "flex", gap: 32, padding: "32px", width: "100%" }}>
        {/* ------------------------ */}
        {/* LEFT — PROFILE PANEL     */}
        {/* ------------------------ */}
        <Card
          style={{
            width: 380,
            padding: 20,
            borderRadius: 16,
            borderColor: "#CC0000",
            background: "white",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <Image
                src={imageURL || profile_img.src}
                width={160}
                height={160}
                style={{
                  borderRadius: "50%",
                  border: "3px solid #CC0000",
                  objectFit: "cover",
                }}
              />

              {editing && (
                <label
                  htmlFor="profileImageInput"
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    background: "white",
                    borderRadius: "50%",
                    border: "2px solid #CC0000",
                    width: 32,
                    height: 32,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <EditOutlined style={{ color: "#CC0000", fontSize: 16 }} />
                </label>
              )}

              <input
                id="profileImageInput"
                type="file"
                accept="image/*"
                onChange={uploadProfileImage}
                style={{ display: "none" }}
              />
            </div>

            <Title level={2} style={{ marginTop: 12 }}>
              {name}
            </Title>

            <Text type="secondary">{user?.email}</Text>

            <Divider />

            {!editing ? (
              <Button
                style={{
                  width: "100%",
                  background: "#CC0000",
                  color: "white",
                  borderRadius: 10,
                  height: 42,
                  fontWeight: 600,
                }}
                icon={<EditOutlined />}
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                style={{
                  width: "100%",
                  background: "white",
                  color: "#CC0000",
                  border: "2px solid #CC0000",
                  borderRadius: 10,
                  height: 42,
                  fontWeight: 600,
                }}
                icon={<SaveOutlined style={{ color: "#CC0000" }} />}
                onClick={saveChanges}
              >
                Save Changes
              </Button>
            )}
          </div>

          {/* PROFILE FIELDS */}
          <div style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 600 }}>Full Name</Text>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editing}
              style={{
                marginTop: 4,
                width: "100%",
                backgroundColor: editing ? "white" : "#f0f0f0",
                color: editing ? "black" : "#888",
                borderColor: editing ? "#CC0000" : "#d9d9d9",
              }}
            />

            <Text style={{ marginTop: 20, display: "block", fontSize: 16, fontWeight: 600 }}>
              BU ID
            </Text>
            <Input
              value={buId}
              onChange={(e) => setBuId(e.target.value)}
              disabled={!editing}
              style={{
                marginTop: 4,
                width: "100%",
                backgroundColor: editing ? "white" : "#f0f0f0",
                color: editing ? "black" : "#888",
                borderColor: editing ? "#CC0000" : "#d9d9d9",
              }}
            />
          </div>
        </Card>

        {/* ------------------------ */}
        {/* RIGHT — CONTENT PANELS   */}
        {/* ------------------------ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* NOTIFICATIONS */}
          <Card title="Email Notifications" style={{ borderRadius: 16 }}>
            <Text style={{ fontSize: 18 }}>Receive reservation confirmations:</Text>
            <br />
            <Switch
              checked={emailNotifications}
              onChange={toggleNotifications}
              checkedChildren={<BellFilled style={{ color: "white" }} />}
              unCheckedChildren={<BellOutlined style={{ color: "#CC0000" }} />}
              style={{
                backgroundColor: emailNotifications ? "#CC0000" : "#d9d9d9",
                marginTop: 10,
              }}
            />
          </Card>

          {/* RESERVATIONS */}
          <Card title="Your Reservations" style={{ borderRadius: 16 }}>
  {reservations.length > 0 ? (
    reservations.map((r) => <MiniEventCard key={r.id} event={r} />)
  ) : (
    <Text style={{ fontSize: 20 }}>None yet</Text>
  )}
</Card>


          {/* BOOKMARKS */}
          <Card title="Your Bookmarks" style={{ borderRadius: 16 }}>
            {bookmarks.length > 0 ? (
              bookmarks.map((ev) => <MiniEventCard key={ev.id} event={ev} />)
            ) : (
              <Text style={{ fontSize: 20 }}>None</Text>
            )}
          </Card>

          {/* EVENTS POSTED */}
          <Card title="Events You Posted" style={{ borderRadius: 16 }}>
            {eventsPosted.length ? (
              eventsPosted.map((ev) => <MiniEventCard key={ev.id} event={ev} />)
            ) : (
              <Text type="secondary">You have not posted any events yet.</Text>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
