"use client";
import { useState } from "react";
import { Button, Tooltip } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { createClient } from "@/lib/supabase/client";
import { BookOutlined, BookFilled } from "@ant-design/icons";


type BookmarkButtonProps = {
  eventId: number;
  eventTitle: string;
};

export default function BookmarkButton({ eventId, eventTitle }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);

  const toggleBookmark = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to bookmark events.");
      return;
    }

    if (bookmarked) {
      // remove bookmark
      await supabase.from("bookmarks")
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
    icon={bookmarked ? <BookFilled style={{ color: "#CC0000" }} /> : <BookOutlined />}
    onClick={toggleBookmark}
    />

    </Tooltip>
  );
}
