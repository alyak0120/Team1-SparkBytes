// app/report/page.tsx
"use client";

import ReportForm from "@/components/report-form";

export default function ReportPage() {
  return (
    <div className="flex justify-center items-start min-h-screen bg-[#FFF8F5] px-2">
      <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-lg">
        <ReportForm />
      </div>
    </div>
  );
}
