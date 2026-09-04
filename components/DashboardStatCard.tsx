"use client";

import type { LucideIcon } from "lucide-react";

const tones = {
  neutral: { bg: "#F3F5F8", fg: "#0B2545" },
  red: { bg: "#FDECEC", fg: "#B91C1C" },
  green: { bg: "#EAF7EE", fg: "#15803D" },
  blue: { bg: "#EAF1FB", fg: "#1D4E89" },
} as const;

export default function DashboardStatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: keyof typeof tones;
}) {
  const selectedTone = tones[tone];
  return (
    <div className="bg-white border rounded-md p-4 flex items-center gap-4" style={{ borderColor: "#DFE3E8" }}>
      <div className="h-11 w-11 rounded-md flex items-center justify-center shrink-0" style={{ background: selectedTone.bg }}>
        <Icon size={20} color={selectedTone.fg} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-gray-900 leading-tight">{value}</p>
        <p className="text-sm text-gray-500 truncate">{label}</p>
      </div>
    </div>
  );
}

