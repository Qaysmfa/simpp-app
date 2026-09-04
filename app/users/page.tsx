"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { ROLE_LABEL, type AuthenticatedUser, type UserRole } from "@/lib/types";

type UserProfile = { id: string; name: string; role: UserRole };

const roleColors: Record<UserRole, string> = {
  pengadilan: "bg-blue-100 text-blue-800 border-blue-300",
  kejaksaan: "bg-green-100 text-green-800 border-green-300",
  admin: "bg-red-100 text-red-800 border-red-300",
};

export default function UsersPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [rows, setRows] = useState<UserProfile[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "pengadilan" as UserRole });
  const [creating, setCreating] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { async function load() { try { const current = await getCurrentUser(); if (!current) { router.replace("/login"); return; } if (current.role !== "admin") { router.replace("/dashboard"); return; } setUser(current); const { data, error: queryError } = await supabase.from("profiles").select("id, name, role").order("name"); if (queryError) throw queryError; setRows((data ?? []) as UserProfile[]); } catch (loadError) { setError(loadError instanceof Error ? loadError.message : "Pengguna gagal dimuat."); } } void load(); }, [router]);
  if (!user) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">{error || "Memuat..."}</div>;
  async function createAccount(event: React.FormEvent) {
    event.preventDefault();
    setCreating(true);
    setError("");
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionData.session?.access_token ?? ""}` }, body: JSON.stringify(form) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Akun gagal dibuat.");
      setForm({ name: "", email: "", password: "", role: "pengadilan" });
      const { data, error: queryError } = await supabase.from("profiles").select("id, name, role").order("name");
      if (queryError) throw queryError;
      setRows((data ?? []) as UserProfile[]);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Akun gagal dibuat.");
    } finally {
      setCreating(false);
    }
  }
  const accountInput = "border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E89]/30 focus:border-[#1D4E89]";
  return <div className="min-h-screen flex" style={{ background: "#F3F5F8" }}><Sidebar role={user.role} view="users" onNavigate={(key) => router.push(key === "cases" ? "/cases" : `/${key}`)} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} /><div className="flex-1 min-w-0"><Header title="User Management" user={user} setMobileOpen={setMobileOpen} /><main className="p-4 lg:p-6 space-y-4">{error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}<form onSubmit={createAccount} className="bg-white border rounded-md p-5 space-y-4" style={{ borderColor: "#DFE3E8" }}><h2 className="font-medium text-gray-900">Buat Akun Baru</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><input required placeholder="Nama" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={accountInput} /><input required type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={accountInput} /><input required minLength={6} type="password" placeholder="Kata sandi (min. 6 karakter)" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className={accountInput} /><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as UserRole })} className={accountInput}><option value="pengadilan">Pengadilan</option><option value="kejaksaan">Kejaksaan</option><option value="admin">Admin</option></select></div><button disabled={creating} className="px-4 py-2 rounded text-sm text-white bg-[#0B2545] disabled:opacity-60">{creating ? "Membuat..." : "Buat Akun"}</button></form><div className="bg-white border rounded-md overflow-hidden" style={{ borderColor: "#DFE3E8" }}><div className="px-5 py-4 border-b text-sm text-gray-500" style={{ borderColor: "#DFE3E8" }}>{rows.length} pengguna terdaftar</div><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-gray-700 border-b bg-[#FAFBFC]"><th className="px-4 py-3 font-medium">Nama</th><th className="px-4 py-3 font-medium">Peran</th><th className="px-4 py-3 font-medium">ID</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-b last:border-0"><td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded border font-medium ${roleColors[row.role]}`}>{ROLE_LABEL[row.role]}</span></td><td className="px-4 py-3 text-gray-700">{row.id}</td></tr>)}</tbody></table></div></div></main></div></div>;
}
