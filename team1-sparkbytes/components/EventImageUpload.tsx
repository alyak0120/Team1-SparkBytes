"use client";

import { Upload, Button, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { UploadRequestOption } from "rc-upload/lib/interface";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function EventImageUpload({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  // ⭐ FIXED: Correct AntD type
  const customUpload = async (options: UploadRequestOption) => {
    const file = options.file as File; // force-cast → valid for image uploads

    try {
      setUploading(true);
      setFileName(file.name);

      const ext = file.name.split(".").pop();
      const filePath = `events/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("event-images")
        .upload(filePath, file);

      if (error) {
        message.error(error.message);
        options.onError?.(error as any);
        return;
      }

      const { data } = supabase.storage
        .from("event-images")
        .getPublicUrl(filePath);

      onUpload(data.publicUrl);

      message.success("Uploaded!");
      options.onSuccess?.({}, file);
    } catch (err) {
      options.onError?.(err as any);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Upload
        accept="image/*"
        maxCount={1}
        customRequest={customUpload} // ✔ fully typed
        showUploadList={false}
      >
        <Button
          icon={<UploadOutlined />}
          disabled={uploading}
          style={{ backgroundColor: "#f5f5f5", borderColor: "#d9d9d9" }}
        >
          {uploading ? "Uploading..." : "Choose Image"}
        </Button>
      </Upload>

      {fileName && (
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Selected: {fileName}
        </Typography.Text>
      )}
    </div>
  );
}
