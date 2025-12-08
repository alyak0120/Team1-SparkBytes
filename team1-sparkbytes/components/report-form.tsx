"use client";

import { useState } from "react";
import { Card, Input, Button, message } from "antd";
import { createClient } from "@/lib/supabase/client";

const { TextArea } = Input;

export default function ReportForm() {
  const supabase = createClient();

  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      message.error("Please enter a description.");
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      message.error("You must be logged in to submit a report.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("reports").insert({
      user_id: user.id,
      description: description.trim(),
    });

    if (error) {
      console.error(error);
      message.error("Failed to submit report.");
    } else {
      message.success("Report submitted. Thank you!");
      setDescription(""); // Reset form
    }

    setSubmitting(false);
  };

  return (
    <Card className="max-w-xl mx-auto mt-10 p-6">
      <h2 className="text-xl font-semibold mb-4">Submit a Report</h2>

      <p className="text-gray-600 mb-3">
        Tell us about any app issue, bug, event problem, or general feedback.
      </p>

      <TextArea
        rows={5}
        placeholder="Describe the issue or feedback..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={1000}
        showCount
      />

      <Button
        type="primary"
        block
        className="mt-4 bg-red-600 hover:bg-red-700"
        loading={submitting}
        onClick={handleSubmit}
      >
        Submit Report
      </Button>
    </Card>
  );
}

