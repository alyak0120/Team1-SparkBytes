"use client";

import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Typography,
  DatePicker,
  TimePicker,
  Space,
  ConfigProvider,
  theme,
  message,
} from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { createClient } from "@/lib/supabase/client";

export default function NewEvent() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const { title, description, area, address, building, room, date, time } =
        values;

      // Combine Date + Time into a single Dayjs
      const combined = dayjs(date)
        .hour(time.hour())
        .minute(time.minute())
        .second(0)
        .millisecond(0);

      const starts_at_ts = combined.toDate(); // for timestamptz column
      const starts_at_text = combined.format("MMM D, YYYY h:mm A"); // optional pretty string

      // Build payload for Supabase insert
      const payload: any = {
        title,
        description,
        area,
        address,
        building: building || null,
        room: room || null,
        starts_at_ts, // new canonical timestamp column
        starts_at: starts_at_text, // optional text column (if you keep it)
        // NOTE: if you later add a category column to events, you can also include:
        // category: values.category,
      };

      const { error } = await supabase.from("events").insert(payload);

      if (error) {
        console.error("Error inserting event:", error);
        message.error("Failed to create event. Please try again.");
        setLoading(false);
        return;
      }

      message.success("Event created!");
      router.push("/post/success");
    } catch (err) {
      console.error("Unexpected error in handleFinish:", err);
      message.error("Something went wrong.");
      setLoading(false);
    }
  };

  const addressRegex =
    /^[0-9A-Za-z\s.,'-]+,\s*[A-Za-z\s]+,\s*[A-Za-z]{2}\s*\d{5}(-\d{4})?$/;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#CC0000",
          borderRadius: 12,
          colorBgContainer: "#fff",
        },
      }}
    >
      <Space
        direction="vertical"
        size="large"
        style={{
          width: "100%",
          padding: "24px 32px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 650,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <Typography.Title
            level={2}
            style={{
              textAlign: "center",
              marginBottom: 24,
              color: "#CC0000",
            }}
          >
            Post a New Event
          </Typography.Title>

          <Form layout="vertical" onFinish={handleFinish}>
            <Form.Item
              label="Event Title"
              name="title"
              rules={[{ required: true, message: "Enter a title" }]}
            >
              <Input placeholder="Enter a title" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Select a category" }]}
            >
              <Select
                placeholder="Select a Category"
                options={[
                  { label: "Pizza", value: "Pizza" },
                  { label: "Breakfast", value: "Breakfast" },
                  { label: "Dessert", value: "Dessert" },
                  { label: "Other", value: "Other" },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Add a short description" }]}
            >
              <Input.TextArea rows={3} placeholder="Describe your event..." />
            </Form.Item>

            <Form.Item
              label="Area of campus"
              name="area"
              rules={[{ required: true, message: "Select an area of campus" }]}
            >
              <Select
                placeholder="Select an area"
                options={[
                  { label: "East Campus", value: "East Campus" },
                  { label: "West Campus", value: "West Campus" },
                  { label: "South Campus", value: "South Campus" },
                  { label: "Central Campus", value: "Central Campus" },
                  { label: "Fenway Campus", value: "Fenway Campus" },
                  { label: "Medical Campus", value: "Medical Campus" },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Street Address, City, State, Zip Code"
              name="address"
              rules={[
                { required: true, message: "Enter a full address" },
                {
                  pattern: addressRegex,
                  message:
                    "Enter a valid format: 700 Commonwealth Ave, Boston, MA 02215",
                },
              ]}
            >
              <Input placeholder="e.g. 700 Commonwealth Ave, Boston, MA 02215" />
            </Form.Item>

            <Form.Item label="Building (optional)" name="building">
              <Input placeholder="e.g. Warren Towers" />
            </Form.Item>

            <Form.Item label="Room Number (optional)" name="room">
              <Input placeholder="e.g. 511, B12, 201" />
            </Form.Item>

            <Space size="large" style={{ display: "flex", width: "100%" }}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Select a date" }]}
                style={{ flex: 1 }}
              >
                <DatePicker
                  format="MM/DD/YYYY"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Time"
                name="time"
                rules={[{ required: true, message: "Select a time" }]}
                style={{ flex: 1 }}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  format="h:mm A"
                  use12Hours
                  minuteStep={5}
                />
              </Form.Item>
            </Space>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 16,
                gap: 12,
              }}
            >
              <Button onClick={() => router.push("/event")} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="primary"
                loading={loading}
                htmlType="submit"
                style={{ minWidth: 120 }}
              >
                Post Event
              </Button>
            </div>
          </Form>
        </Card>
      </Space>
    </ConfigProvider>
  );
}
