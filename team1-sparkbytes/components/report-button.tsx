"use client";

import { useState } from "react";
import { Button, Modal, Form, Input, message, Tooltip, Select } from "antd";
import { FlagOutlined } from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type ReportButtonProps = {
  eventId: number;
  eventTitle: string;
  iconOnly?: boolean;
};

export default function ReportButton({ eventId, eventTitle, iconOnly }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const submitReport = async (values: any) => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      message.error("You must be logged in to report events.");
      setLoading(false);
      return;
    }

    const { reason, details } = values;

    const { error } = await supabase.from("reports").insert({
      user_id: user.id,
      user_email: user.email,        // ⭐ ADDED THIS
      event_id: eventId,
      event_title: eventTitle,
      report_type: reason,
      comment: details,
    });

    if (error) {
      console.error(error);
      message.error("Failed to submit report.");
      setLoading(false);
      return;
    }

    // Close form modal
    setOpen(false);
    setLoading(false);

    // Show success modal
    setSuccessOpen(true);
  };

  const button = (
    <Button
      type={iconOnly ? "text" : "default"}
      danger={!iconOnly}
      icon={<FlagOutlined style={{ color: iconOnly ? "#CC0000" : undefined }} />}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(true);
      }}
    >
      {!iconOnly && "Report"}
    </Button>
  );

  return (
    <>
      <Tooltip title="Report">{button}</Tooltip>
      <div onClick={(e) => e.stopPropagation()}>
      {/* FORM MODAL */}
      <Modal
        title={`Report Event: ${eventTitle}`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={submitReport}>
          <Form.Item
            label="Reason for Report"
            name="reason"
            rules={[{ required: true, message: "Please select a reason." }]}
          >
            <Select placeholder="Select a reason">
              <Select.Option value="inaccurate_info">Inaccurate Information</Select.Option>
              <Select.Option value="food_safety">Food Safety Issue</Select.Option>
              <Select.Option value="already_gone">No Servings Left</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Describe the Issue"
            name="details"
            rules={[{ required: true, message: "Please provide details." }]}
          >
            <Input.TextArea rows={4} placeholder="Tell us what happened..." />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Submit Report
          </Button>
        </Form>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal
        title="Report Submitted"
        open={successOpen}
        footer={null}
        onCancel={() => setSuccessOpen(false)}
      >
        <p>Your report has been successfully submitted.</p>

        <Button
          type="primary"
          block
          style={{ marginTop: 16 }}
          onClick={() => {
            setSuccessOpen(false);
            router.push("/event"); // return to dashboard
          }}
        >
          Return to Dashboard
        </Button>
      </Modal>
      </div>
    </>
  );
}

