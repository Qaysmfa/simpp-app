"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CaseForm from "@/components/CaseForm";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { AuthenticatedUser, CaseInput } from "@/lib/types";

export default function AddCasePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { void getCurrentUser().then((current) => { if (!current) router.replace("/login"); else if (current.role !== "pengadilan") router.replace("/dashboard"); else setUser(current); }).catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Akses ditolak.")); }, [router]);
  if (!user) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">{error || "Memuat..."}</div>;
  async function save(form: CaseInput) {
    const currentUser = user;
    if (!currentUser) return;
    const { data, error: insertError } = await supabase.from("cases").insert({ ...form, status: "belum" }).select("id, nomor_perkara").single();
    if (insertError) { setError(insertError.message); return; }
    const { error: activityError } = await supabase.from("activity_log").insert({ user_name: currentUser.nama, action: "Menambahkan jadwal", case_number: data.nomor_perkara, previous_value: null, new_value: "Belum Dibacakan" });
    if (activityError) { setError(activityError.message); return; }
    router.push(`/cases/${data.id}`);
  }
  return <div className="min-h-screen flex" style={{ background: "#F3F5F8" }}><Sidebar role={user.role} view="add" onNavigate={(key) => router.push(key === "cases" ? "/dashboard" : `/${key}`)} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} /><div className="flex-1 min-w-0"><Header title="Tambah Jadwal Pembacaan" user={user} setMobileOpen={setMobileOpen} /><main className="p-4 lg:p-6 space-y-4 max-w-4xl">{error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}<CaseForm onCancel={() => router.push("/dashboard")} onSave={(form) => void save(form)} /></main></div></div>;
}
