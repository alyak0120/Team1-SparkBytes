"use client";

import { Card, Typography, Space, Tooltip } from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

import BookmarkButton from "@/components/bookmark-button";
import ReportButton from "@/components/report-button";
import ReserveButton from "@/components/reserve-button";

export default function EventCard({
  event,
  reserves,
  reserve,
  onOpenModal
}: any) {

  return (
    //singular card component for event //
    <Card
      hoverable
      onClick={() => onOpenModal(event)}
      /* cover is img submitted by user or default */
      cover={
        <img
          alt={event.title}
          src={event.image_url || "/default-event.jpg"}
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
      <div style={{ padding: "12px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        
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
        >
          {event.description}
        </p>

        <Space direction="vertical" size={2}>
          <Typography.Text>
            <EnvironmentOutlined /> {event.location}
          </Typography.Text>

          <Typography.Text>
            <ClockCircleOutlined /> {event.time}
          </Typography.Text>

          <Typography.Text>
            <UserOutlined /> {event.servings_left} servings left
          </Typography.Text>
        </Space>
      </div>

      {/* Footer Actions */}
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

        {/* Reserve Button */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <ReserveButton
            event={event}
            reserves={reserves}
            reserve={reserve}
          />
        </div>

        {/* Report Button */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Tooltip title="Report">
            <ReportButton eventId={event.id} eventTitle={event.title} iconOnly />
          </Tooltip>
        </div>
      </div>
    </Card>
  );
}
