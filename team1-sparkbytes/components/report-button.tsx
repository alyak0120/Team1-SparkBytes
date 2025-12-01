"use client";

import { useState } from "react";
import { Button, Modal, Select, Input, message } from "antd";
import { FlagOutlined } from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";

const { TextArea } = Input;

interface ReportButtonProps {
  eventId: number;  //bigint in DB, number in TS
  eventTitle?: string; //modal title
}

export default function ReportButton({ eventId, eventTitle }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState<string | undefined>();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      setReportType(undefined);
      setComment("");
    }
  };

  const handleSubmit = async () => {
    if (!reportType) {
      message.error("Please select a report type.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // 1) get current logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        message.error("You must be logged in to submit a report.");
        setLoading(false);
        return;
      }

      //insert into reports table
      const { error } = await supabase.from("reports").insert({
        user_id: user.id,  //uuid
        event_id: eventId, //bigint
        report_type: reportType,
        comment: comment || null,
      });

      if (error) {
        console.error("Error submitting report:", error);
        message.error("Could not submit report. Please try again.");
      } else {
        message.success("Report submitted. Thank you for your feedback.");
        handleClose();
      }
    } catch (err) {
      console.error("Unexpected error submitting report:", err);
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* report. button */}
      <Button
        icon={<FlagOutlined />}
        size="small"
        onClick={handleOpen}
        danger
        type="text"
      >
        Report
      </Button>

      <Modal
        title={eventTitle ? `Report "${eventTitle}"` : "Report this event"}
        open={open}
        onOk={handleSubmit}
        onCancel={handleClose}
        confirmLoading={loading}
        okText="Submit report"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Report type</label>
            <Select
              value={reportType}
              onChange={(value) => setReportType(value)}
              placeholder="Choose a reason"
              style={{ width: "100%" }}
            >
              <Select.Option value="inaccurate-info">
                Inaccurate information
              </Select.Option>
              <Select.Option value="inappropriate-content">
                Inappropriate content
              </Select.Option>
              <Select.Option value="safety-concern">
                Safety concern
              </Select.Option>
              <Select.Option value="other">
                Other
              </Select.Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1">
              Additional details (optional)
            </label>
            <TextArea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the issue..."
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
