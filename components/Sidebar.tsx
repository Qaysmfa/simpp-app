"use client";

import { ClipboardList, FileText, LayoutDashboard, LogOut, PlusCircle, Scale, Settings, Users } from "lucide-react";
import type { UserRole } from "@/lib/types";
import { signOut } from "@/lib/auth";

export default function Sidebar({
  role,
  view,
  onNavigate,
  mobileOpen,
  setMobileOpen,
}: {
  role: UserRole;
  view: string;
  onNavigate: (key: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
    { key: "cases", label: "Semua Perkara", icon: FileText, show: true },
    { key: "add", label: "Tambah Pembacaan", icon: PlusCircle, show: role === "pengadilan" },
    { key: "activity", label: "Activity Log", icon: ClipboardList, show: role === "admin" },
    { key: "users", label: "User Management", icon: Users, show: role === "admin" },
    { key: "settings", label: "Settings", icon: Settings, show: true },
  ];
  const button = (item: (typeof items)[number]) => (
    <button key={item.key} onClick={() => { onNavigate(item.key); setMobileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors" style={{ background: view === item.key ? "#13345F" : "transparent", color: view === item.key ? "#FFFFFF" : "#B7C4D8" }}>
      <item.icon size={17} /><span>{item.label}</span>
    </button>
  );
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-40 flex flex-col shrink-0 transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`} style={{ background: "#0B2545" }}>
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "#13345F" }}><div className="h-9 w-9 rounded-md bg-white/10 flex items-center justify-center"><Scale size={18} color="#FFFFFF" /></div><div className="leading-tight min-w-0"><p className="text-white text-sm font-semibold">SIMPP</p><p className="text-[11px] text-[#93A5C2] truncate">Monitoring Pembacaan Perkara</p></div></div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5"><div>{button(items[0])}</div><div><p className="px-3 text-[11px] font-medium text-[#6C81A3] mb-1.5">Perkara</p><div className="space-y-1">{items.slice(1, 3).filter((item) => item.show).map(button)}</div></div>{role === "admin" && <div><p className="px-3 text-[11px] font-medium text-[#6C81A3] mb-1.5">Administrasi</p><div className="space-y-1">{items.slice(3, 5).map(button)}</div></div>}<div>{button(items[5])}</div></nav>
        <div className="px-3 py-4 border-t" style={{ borderColor: "#13345F" }}><button onClick={async () => { await signOut(); window.location.assign("/login"); }} className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-[#B7C4D8] hover:bg-[#081B33]"><LogOut size={17} /><span>Logout</span></button></div>
      </aside>
    </>
  );
}
