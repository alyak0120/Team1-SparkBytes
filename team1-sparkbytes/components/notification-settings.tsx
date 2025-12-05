"use client";

import { useEffect, useState } from "react";
import { Switch, Spin, message } from "antd";
import { createClient } from "@/lib/supabase/client";

export default function NotificationSettings() {
  const supabase = createClient();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn("No logged-in user found for notification settings.");
        setEnabled(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("email_notifications_enabled")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading notification settings", error);
        message.error("Could not load notification settings.");
        setEnabled(false);
        return;
      }

      setEnabled(data?.email_notifications_enabled ?? false);
    };

    loadSettings();
  }, []);

  const handleToggle = async (checked: boolean) => {
    setSaving(true);
    setEnabled(checked);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      message.error("You must be logged in to change notification settings.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ email_notifications_enabled: checked })
      .eq("id", user.id);

    if (error) {
      console.error(error);
      message.error("Failed to update notification settings.");
      setEnabled(!checked); // revert
    } else {
      message.success(
        checked
          ? "Email notifications enabled."
          : "Email notifications disabled."
      );
    }

    setSaving(false);
  };

  if (enabled === null) {
    return (
      <div className="flex items-center gap-2">
        <Spin size="small" />
        <span className="text-sm text-gray-500">Loading settings…</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between max-w-xl">
      <div>
        <div className="font-medium">Email notifications</div>
        <div className="text-sm text-gray-500">
          Get emails about upcoming events and updates.
        </div>
      </div>

      <Switch
        checked={enabled}
        onChange={handleToggle}
        loading={saving}
      />
    </div>
  );
}
