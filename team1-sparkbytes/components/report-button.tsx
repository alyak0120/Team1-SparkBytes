"use client";

import { useState } from "react";
import { Button, Modal, Form, Input, message, Tooltip, Select } from "antd";
import { FlagOutlined } from "@ant-design/icons";

type ReportButtonProps = {
  eventId: number;
  eventTitle: string;
  iconOnly?: boolean;
};

export default function ReportButton({ eventId, eventTitle, iconOnly }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitReport = async (values: any) => {
    setLoading(true);

    // TODO: send to Supabase or API route
    await new Promise((res) => setTimeout(res, 800));

    console.log("Report submitted:", {
      eventId,
      ...values,
    });

    message.success("Report submitted.");
    setLoading(false);
    setOpen(false);
  };

  const button = (
    <Button
      type={iconOnly ? "text" : "default"}
      danger={!iconOnly}
      icon={<FlagOutlined style={{ color: iconOnly ? "#CC0000" : undefined }} />}
      onClick={() => setOpen(true)}
    >
      {!iconOnly && "Report"}
    </Button>
  );

  return (
    <>
      <Tooltip title="Report">{button}</Tooltip>

      <Modal
        title={`Report Event: ${eventTitle}`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={submitReport}>
          {/* NEW dropdown field */}
          <Form.Item
            label="Reason for Report"
            name="reason"
            rules={[{ required: true, message: "Please select a reason." }]}
          >
            <Select placeholder="Select a reason">
              <Select.Option value="inaccurate">Inaccurate Information</Select.Option>
              <Select.Option value="food_safety">Food Safety Issue</Select.Option>
              <Select.Option value="no_servings">No Servings Left</Select.Option>
              <Select.Option value="inappropriate">Inappropriate Content</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          {/* Description box */}
          <Form.Item
            label="Describe the Issue"
            name="details"
            rules={[{ required: true, message: "Please provide details." }]}
          >
            <Input.TextArea rows={4} placeholder="Tell us what happened..." />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginTop: 12 }}
            block
          >
            Submit Report
          </Button>
        </Form>
      </Modal>
    </>
  );
}

