"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { ActivityLog, AuthenticatedUser } from "@/lib/types";

export default function ActivityPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [rows, setRows] = useState<ActivityLog[]>([]);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { async function load() { try { const current = await getCurrentUser(); if (!current) { router.replace("/login"); return; } if (current.role !== "admin") { router.replace("/dashboard"); return; } setUser(current); const { data, error: queryError } = await supabase.from("activity_log").select("*").order("created_at", { ascending: false }); if (queryError) throw queryError; setRows((data ?? []) as ActivityLog[]); } catch (loadError) { setError(loadError instanceof Error ? loadError.message : "Activity log gagal dimuat."); } } void load(); }, [router]);
  if (!user) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">{error || "Memuat..."}</div>;
  return <div className="min-h-screen flex" style={{ background: "#F3F5F8" }}><Sidebar role={user.role} view="activity" onNavigate={(key) => router.push(key === "cases" ? "/cases" : `/${key}`)} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} /><div className="flex-1 min-w-0"><Header title="Activity Log" user={user} setMobileOpen={setMobileOpen} /><main className="p-4 lg:p-6">{error ? <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div> : <div className="bg-white border rounded-md overflow-x-auto" style={{ borderColor: "#DFE3E8" }}><table className="w-full text-sm"><thead><tr className="text-left text-gray-700 border-b bg-[#FAFBFC]">{["Pengguna", "Aksi", "No. Perkara", "Nilai Sebelumnya", "Nilai Baru", "Waktu"].map((heading) => <th key={heading} className="px-4 py-3 font-medium whitespace-nowrap">{heading}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-b last:border-0"><td className="px-4 py-3 text-gray-900 font-medium">{row.user_name}</td><td className="px-4 py-3 text-gray-900">{row.action}</td><td className="px-4 py-3 text-gray-900">{row.case_number || "-"}</td><td className="px-4 py-3 text-gray-700">{row.previous_value || "-"}</td><td className="px-4 py-3 text-gray-700">{row.new_value || "-"}</td><td className="px-4 py-3 text-gray-700 whitespace-nowrap">{new Date(row.created_at).toLocaleString("id-ID")}</td></tr>)}</tbody></table></div>}</main></div></div>;
}
