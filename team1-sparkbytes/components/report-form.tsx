// components/report-form.tsx
"use client";

import { useState } from "react";
import { Button, Select } from "antd";
import { createClient } from "@/lib/supabase/client";

const { Option } = Select;
const supabase = createClient();

type ReportFormProps = {
  /** Optional: pre-fill when reporting from an event card */
  eventId?: number;
  eventTitle?: string;
};

export default function ReportForm({
  eventId,
  eventTitle,
}: ReportFormProps) {
  const [reportType, setReportType] = useState<string | undefined>();
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        throw new Error("You need to be logged in to submit a report.");
      }
      console.log("REPORT TYPE BEING SENT:", reportType);
      const { error: insertError } = await supabase.from("reports").insert({
        user_id: user.id,
        user_email: email || user.email, // allow override or use account email
        event_id: eventId ?? null,
        event_title: eventTitle ?? null,
        report_type: reportType ?? null,
        comment,
      });

      if (insertError) throw insertError;

      // Very simple success behaviour – redirect to success page
      window.location.href = "/report/success";
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 pt-8">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg border border-[#ffe0d3]">
        <h1 className="mb-2 text-2xl font-semibold text-[#b22222]">
          Send us a report
        </h1>
        <p className="mb-6 text-sm text-[#555]">
          Use this form to report issues with events or the SparkBytes website.
          You can leave the event fields blank if this is a general app issue.
        </p>

        {eventTitle && (
          <div className="mb-4 rounded-lg bg-[#fff3ec] px-4 py-3 text-sm">
            <span className="font-medium text-[#b22222]">Event:</span>{" "}
            <span className="font-medium">{eventTitle}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email (optional override) */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#333]"
            >
              Contact email <span className="text-xs text-[#888]">(optional)</span>
            </label>
            {/* Native input so `required` is valid if you want it later */}
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@bu.edu"
              className="w-full rounded-lg border border-[#e3c6bb] bg-white px-3 py-2 text-sm outline-none focus:border-[#ff7a59] focus:ring-2 focus:ring-[#ffd3c0]"
            />
          </div>

          {/* Report type */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#333]">
              What is this report about? <span className="text-red-500">*</span>
            </label>
            <Select
              value={reportType}
              onChange={setReportType}
              placeholder="Select a report type"
              className="w-full"
            >
              <Option value="bug_issue">Bug / issue</Option>
              <Option value="incorrect_event_info">Incorrect event info</Option>
              <Option value="food_dietary_concern">
                Food / dietary concern
              </Option>
              <Option value="accessibility">Accessibility</Option>
              <Option value="other">Other</Option>
            </Select>
          </div>

          {/* Message / comment */}
          <div className="space-y-1">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-[#333]"
            >
              Tell us what happened <span className="text-red-500">*</span>
            </label>
            {/* Native textarea so `required` works */}
            <textarea
                    id="comment"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    placeholder="Describe the issue, any steps to reproduce it, and anything else we should know."
                    className="w-full rounded-lg border border-[#e3c6bb] bg-white px-3 py-2 text-sm text-black outline-none focus:border-[#ff7a59] focus:ring-2 focus:ring-[#ffd3c0]"
                    />

          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className="bg-[#ff7a59] hover:!bg-[#ff5c3a] border-none px-5 rounded-full"
            >
              Submit report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
