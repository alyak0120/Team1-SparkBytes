"use client";
import { useEffect, useState } from "react";
import { Card, Row, Col, Empty, Typography } from "antd";
import { createClient } from "@/lib/supabase/client";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id);

      if (error) console.error(error);
      else setBookmarks(data || []);
    };

    fetchBookmarks();
  }, []);

  return (
    <Row gutter={[16, 16]}>
      {bookmarks.length === 0 ? (
        <Empty description="No bookmarks yet" />
      ) : (
        bookmarks.map((bm) => (
          <Col key={bm.id} xs={24} sm={12} md={8}>
            <Card title={bm.event_title}>
              <Typography.Text>
                Bookmarked at: {new Date(bm.created_at).toLocaleString()}
              </Typography.Text>
            </Card>
          </Col>
        ))
      )}
    </Row>
  );
}
