"use client";

import { useState } from "react";
import { Modal, Button, Form, Input, Select } from "antd";
import { FlagOutlined } from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";

const { TextArea } = Input;

type ReportButtonProps = {
  eventId: number;        // matches events.id (bigint)
  eventTitle: string;
};

export default function ReportButton({ eventId, eventTitle }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [submittedOpen, setSubmittedOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      // validate form fields
      const values = await form.validateFields();
      setLoading(true);

      const supabase = createClient();

      // get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Auth error:", userError);
        alert("You must be logged in to submit a report.");
        return;
      }

      // insert row into reports table
      const { error } = await supabase.from("reports").insert({
        user_id: user.id,           // uuid
        event_id: eventId,          // bigint (int8)
        event_title: eventTitle,    // make sure this column exists in reports
        report_type: values.type,   // from the Select
        comment: values.comment || "",
      });

      if (error) {
        console.error("Insert error:", error);
        alert("Failed to submit report. Check console for details.");
        return;
      }

      // success – close form and show thank-you modal
      form.resetFields();
      setOpen(false);
      setSubmittedOpen(true);
    } catch (err) {
      console.error("Unexpected error submitting report:", err);
      alert("Something went wrong submitting the report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button on the card */}
      <Button
        danger
        icon={<FlagOutlined />}
        onClick={() => setOpen(true)}
      >
        Report
      </Button>

      {/* Report form modal */}
      <Modal
        title={`Report: ${eventTitle}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        okText="Submit report"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Report type"
            name="type"
            rules={[{ required: true, message: "Please choose a report type" }]}
          >
            <Select
              placeholder="Select a reason"
              options={[
                { value: "inaccurate_info", label: "Inaccurate information" },
                { value: "food_safety", label: "Food safety concern" },
                { value: "already_gone", label: "Food already gone" },
                { value: "other", label: "Other" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Additional comments" name="comment">
            <TextArea rows={4} placeholder="Optional details..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* thank you*/}
      <Modal
        open={submittedOpen}
        footer={
          <Button type="primary" onClick={() => setSubmittedOpen(false)}>
            Back to events
          </Button>
        }
        onCancel={() => setSubmittedOpen(false)}
      >
        <p>Thank you! Your report has been submitted.</p>
      </Modal>
    </>
  );
}
