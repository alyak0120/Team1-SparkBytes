"use client";

import { Form, Input, Select, Button, Card, Typography, DatePicker, TimePicker, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
//options for dietary
const dietaryOptions = [
  { label: "Vegan", value: "Vegan" },
  { label: "Vegetarian", value: "Vegetarian" },
  { label: "Halal", value: "Halal" },
  { label: "Kosher", value: "Kosher" },
  { label: "Gluten-Free", value: "Gluten-Free" },
  { label: "Pescatarian", value: "Pescatarian" },
];

//options for allergies
const allergyOptions = [
  { label: "Dairy-Free", value: "Dairy-Free" },
  { label: "Nut-Free", value: "Nut-Free" },
  { label: "Soy-Free", value: "Soy-Free" },
  { label: "Shellfish-Free", value: "Shellfish-Free" },
];

//options for part of BU campus
const campusOptions = [
  { label: "West", value: "West" },
  { label: "East", value: "East" },
  { label: "Central", value: "Central" },
  { label: "Fenway", value: "Fenway" },
];

//main function for posting a new event
export default function NewEvent() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [msgApi, contextHolder] = message.useMessage();

 const handleFinish = async (values: any) => {
  setLoading(true);

  try {
    const { date, start_time, end_time } = values;

    if (!date || !start_time || !end_time) {
      msgApi.error("Please select date and times");
      setLoading(false);
      return;
    }

    // Combine date and time into ISO strings
    const startDateTime = date
      .hour(start_time.hour())
      .minute(start_time.minute())
      .second(0);

    const endDateTime = date
      .hour(end_time.hour())
      .minute(end_time.minute())
      .second(0);

    if (!startDateTime.isValid() || !endDateTime.isValid()) {
      msgApi.error("Invalid date/time");
      setLoading(false);
      return;
    }

    // -----------------------------
    // 1. Upload image to Supabase Storage (if selected)
    // -----------------------------
    let image_url: string | null = null;
    const file = values.image?.[0]?.originFileObj;
    if (file) {
    const fileExt = file.name.split(".").pop();
    const fileName = `events/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(fileName, file);

    if (uploadError) {
        console.log("Uploading to bucket: event_images", fileName);
        console.error(uploadError);
        console.error("Supabase storage error:", uploadError);
        msgApi.error("Failed to upload image");
    } else {
        const publicData = supabase.storage.from("event-images").getPublicUrl(fileName);
        image_url = publicData.data.publicUrl;
    }
    }

    // -----------------------------
    // 2. Build payload for API
    // -----------------------------
    const payload = {
      title: values.title,
      description: values.description,
      location: values.location,
      campus: values.campus,
      address: values.address || null,
      capacity: Number(values.capacity),
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      dietary_tags: values.dietary_tags || [],
      allergy_tags: values.allergy_tags || [],
      image_url, // <-- link to Supabase image
    };

    console.log("Payload:", payload);

    // -----------------------------
    // 3. Submit to your API
    // -----------------------------
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("API error:", result);
      msgApi.error(result.error || "Failed to post event");
    } else {
      msgApi.success("Event posted successfully!");
      router.push("/post/success");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    msgApi.error("Unexpected error occurred");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      {contextHolder}
      <Card>
        {/* post event form title */}
        <Typography.Title level={3}>Post a New Event</Typography.Title>
        
        {/* when submitted, call handleFinish function */}
        <Form layout="vertical" onFinish={handleFinish}>
          
          {/* space for inputting event title, required */}
          <Form.Item label="Event Title" name="title" rules={[{ required: true, message: "Enter a title" }]}>
            <Input placeholder="Enter a title" />
          </Form.Item>

          {/* space for inputting event description, required */}
          <Form.Item label="Description" name="description" rules={[{ required: true, message: "Enter a description" }]}>
            <Input.TextArea rows={3} placeholder="Describe your event..." />
          </Form.Item>

          {/* space for selecting dietary options, optional */}
          <Form.Item label="Dietary Options" name="dietary_tags">
            <Select mode="multiple" options={dietaryOptions} placeholder="Select dietary options" />
          </Form.Item>

          {/* space for selecting allergy warnings, optional */}
          <Form.Item label="Allergy Warnings" name="allergy_tags">
            <Select mode="multiple" options={allergyOptions} placeholder="Select allergy warnings" />
          </Form.Item>

          {/* space for inputting campus location, required */}
          <Form.Item label="Location" name="location" rules={[{ required: true, message: "Enter the location" }]}>
            <Input placeholder="CFA Lobby, Warren Towers, StuVi 2 Lounge..." />
          </Form.Item>

          {/* space for selecting area of campus, required */}
          <Form.Item label="Campus" name="campus" rules={[{ required: true, message: "Select a campus" }]}>
            <Select placeholder="Select campus" options={campusOptions} />
          </Form.Item>

          {/* space for inputting address, optional */}
          <Form.Item label="Address (Optional)" name="address">
            <Input placeholder="700 Commonwealth Ave..." />
          </Form.Item>

          {/* space for inputting event capacity, required, must be integer in range */}
          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[
              { required: true, message: "Enter capacity" },
              {
                validator: (_, value) => {
                  const num = Number(value);
                  if (!Number.isInteger(num)) return Promise.reject("Capacity must be an integer");
                  if (num <= 0) return Promise.reject("Capacity must be greater than 0");
                  if (num > 5000) return Promise.reject("Capacity is too large");
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" placeholder="30" />
          </Form.Item>

          {/* space for picking event date, required */}
          <Form.Item label="Event Date" name="date" rules={[{ required: true, message: "Select a date" }]}>
            <DatePicker />
          </Form.Item>

          {/* space for inputting event start time, required */}
          <Form.Item label="Start Time" name="start_time" rules={[{ required: true, message: "Select start time" }]}>
            <TimePicker format="hh:mm A" use12Hours />
          </Form.Item>

          {/* space for inputting event end time, required */}
          <Form.Item label="End Time" name="end_time" rules={[{ required: true, message: "Select end time" }]}>
            <TimePicker format="hh:mm A" use12Hours />
          </Form.Item>

          {/* space for uploading event image, optional */}
          <Form.Item label="Event Image (optional)" name="image" valuePropName="fileList" getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}>
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          {/* logic for if form is cancelled (route to home page) or event is posted */}
          <div style={{ display: "flex", gap: "16px" }}>
            <Button onClick={() => router.push("/event")} disabled={loading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} style={{ backgroundColor: "#CC0000", borderColor: "#CC0000", color: "#fff" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1890ff")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#CC0000")}>
              Post Event
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
}
