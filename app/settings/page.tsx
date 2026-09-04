"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { ROLE_LABEL, type AuthenticatedUser } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { void getCurrentUser().then((current) => { if (!current) router.replace("/login"); else setUser(current); }); }, [router]);
  if (!user) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Memuat...</div>;
  return <div className="min-h-screen flex" style={{ background: "#F3F5F8" }}><Sidebar role={user.role} view="settings" onNavigate={(key) => router.push(key === "cases" ? "/dashboard" : `/${key}`)} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} /><div className="flex-1 min-w-0"><Header title="Pengaturan" user={user} setMobileOpen={setMobileOpen} /><main className="p-4 lg:p-6"><div className="max-w-lg bg-white border rounded-md p-6 space-y-4" style={{ borderColor: "#DFE3E8" }}><div><label className="block text-sm text-gray-700 mb-1.5">Nama</label><input disabled value={user.nama} className="w-full border rounded px-3 py-2 text-sm text-gray-500 bg-gray-50" /></div><div><label className="block text-sm text-gray-700 mb-1.5">Peran</label><input disabled value={ROLE_LABEL[user.role]} className="w-full border rounded px-3 py-2 text-sm text-gray-500 bg-gray-50" /></div><p className="text-xs text-gray-400 pt-2 border-t">Pengaturan akun akan tersedia setelah sistem terhubung ke basis data.</p></div></main></div></div>;
}
