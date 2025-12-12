"use client";

import { useEffect, useState } from "react";
import { Button, Tooltip } from "antd";
import { BookOutlined, BookFilled } from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";

type BookmarkButtonProps = {
  eventId: number;
  eventTitle: string;
};

export default function BookmarkButton({ eventId, eventTitle }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);

  const supabase = createClient();

  // Load bookmark state on mount
  useEffect(() => {
    const loadBookmark = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("event_id", eventId)
        .single();

      setBookmarked(!!data);
    };

    loadBookmark();
  }, [eventId]);

  const toggleBookmark = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to bookmark events.");
      return;
    }

    if (bookmarked) {
      // remove bookmark
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("event_id", eventId);

      setBookmarked(false);
    } else {
      // add bookmark
      await supabase.from("bookmarks").insert({
        user_id: user.id,
        user_email: user.email,
        event_id: eventId,
        event_title: eventTitle,
      });

      setBookmarked(true);
    }
  };

  return (
    <Tooltip title={bookmarked ? "Remove bookmark" : "Add bookmark"}>
      <Button
        type="text"
        icon={
          bookmarked ? (
            <BookFilled style={{ color: "#CC0000" }} />
          ) : (
            <BookOutlined />
          )
        }
        onClick={(e) => {
          e.stopPropagation();
          toggleBookmark();
        }}
      />
    </Tooltip>
  );
}
