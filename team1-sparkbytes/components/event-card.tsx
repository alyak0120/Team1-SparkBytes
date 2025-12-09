"use client";
import { Card, Typography, Space, Tooltip, Button } from "antd";
import {
  CheckOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";

import BookmarkButton from "@/components/bookmark-button";
import ReportButton from "@/components/report-button";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function EventCard({
  event,
  reserves,
  reserve,
}: any) {
  async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }

    if (user) {
      console.log('Currently logged in user:', user);
      // setUser(user);
      return user;
    } else {
      console.log('No user is currently logged in.');
      return null;
    }
  }

  async function handleReserve() { // Function to handle reserves on event page
    const user = await getCurrentUser(); // Grab current logged user
    if (user) { // Case: A user is logged in
      console.log("handling reserve with user: ", user);

      const {data, error} = await supabase
      .from('reservations').select('*').eq('event_id', `${event.id}`).eq('user_id', `${user.id}`);
      if (error) {
        console.error('Error fetching user data:', error.message);
        alert('There was an error trying to process your request, please try again later.')
      } else {
        if (data.length > 0) { // The user already reserved this event, remove the reservations
          const { error } = await supabase
          .from('reservations').delete().eq('event_id', `${event.id}`).eq('user_id', `${user.id}`);

          if (error) {
            console.error('Error deleting row:', error.message);
          } else {
            console.log('Row delete successfully.')
          }
        } else { // The user has not reserved this event, add reservation
          const {data, error} = await supabase
          .from('reservations').insert([
            { event_id: `${event.id}`, user_id: `${user.id}`}
          ]);
          
          if (error) {
            console.error('Error inserting data:', error.message);
          } else {
            console.log('Data inserted successfully:', data);
          }
        }
      } 
    } else {
      alert('You need to be logged in to reserve an event!');
      return;
    }
    
    reserve(event.id);
  }

  return (
    <Card
      hoverable
      cover={
        <img
          alt={event.title}
          src={event.image || "/default-event.jpg"}
          style={{
            width: "100%",
            height: 180,
            objectFit: "cover",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        />
      }
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: 450,
      }}
    >
      {/* Card Body */}
      <div style={{ padding: "12px 16px", flex: 1, display: "flex",flexDirection: "column"}}>
        <Typography.Title level={5} style={{ marginBottom: 4 }}>
          {event.title}
        </Typography.Title>

        <p
          style={{
            fontSize: 14,
            marginBottom: 8,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
          >{event.description}</p>

        <Space direction="vertical" size={2}>
          <Typography.Text>
            <EnvironmentOutlined /> {event.location}
          </Typography.Text>
          <Typography.Text>
            <ClockCircleOutlined /> {event.time}
          </Typography.Text>
          <Typography.Text>
            <UserOutlined /> {event.servingsLeft} servings left
          </Typography.Text>
        </Space>
      </div>

      {/* Footer with evenly spaced actions */}
      <div
        style={{
          display: "flex",
          width: "100%",
          borderTop: "1px solid #f0f0f0",
          padding: "8px 12px",
        }}
      >

        {/* Bookmark */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <BookmarkButton eventId={event.id} eventTitle={event.title} />
        </div>

        {/* Reserve */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Button
            type={reserves.includes(event.id) ? "default" : "primary"}
            style={{
              transition: "all 0.3s ease",
              backgroundColor: reserves.includes(event.id)
                ? "#52c41a"
                : undefined,
              color: reserves.includes(event.id) ? "#fff" : undefined,
            }}
            icon={reserves.includes(event.id) ? <CheckOutlined /> : null}
            onClick={handleReserve}
          >
            {reserves.includes(event.id) ? "Reserved" : "Reserve"}
          </Button>
        </div>

        {/* Report (icon-only version) */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Tooltip title="Report">
            <ReportButton eventId={event.id} eventTitle={event.title} iconOnly />
          </Tooltip>
        </div>
      </div>
    </Card>
  );
}
