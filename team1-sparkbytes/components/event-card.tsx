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

export default function EventCard({
  event,
  favorites,
  favs,
  reserves,
  reserve,
}: any) {
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
        minHeight: 380,
      }}
    >
      {/* Card Body */}
      <div style={{ padding: "12px 16px" }}>
        <Typography.Title level={5} style={{ marginBottom: 4 }}>
          {event.title}
        </Typography.Title>

        <p>{event.description}</p>

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
        {/* Favorite */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Tooltip title="Favorite">
            <Button
              type="text"
              icon={
                favorites.includes(event.id) ? (
                  <HeartFilled style={{ color: "#CC0000" }} />
                ) : (
                  <HeartOutlined />
                )
              }
              onClick={() => favs(event.id)}
            />
          </Tooltip>
        </div>

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
            onClick={() => reserve(event.id)}
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
