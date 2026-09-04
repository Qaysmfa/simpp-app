"use client";

import type { CaseStatus } from "@/lib/types";

export default function StatusBadge({
  status,
  size = "md",
}: {
  status: CaseStatus;
  size?: "sm" | "md";
}) {
  const isSudah = status === "sudah";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      } font-medium border`}
      style={
        isSudah
          ? { background: "#EAF7EE", color: "#166534", borderColor: "#BEE7C7" }
          : { background: "#FDECEC", color: "#991B1B", borderColor: "#F5C2C2" }
      }
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: isSudah ? "#16A34A" : "#DC2626" }}
      />
      {isSudah ? "Sudah Dibacakan" : "Belum Dibacakan"}
    </span>
  );
}

