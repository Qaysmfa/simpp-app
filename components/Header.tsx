"use client";

import { Menu } from "lucide-react";
import type { AuthenticatedUser } from "@/lib/types";
import { ROLE_LABEL } from "@/lib/types";

export default function Header({
  title,
  user,
  setMobileOpen,
}: {
  title: string;
  user: AuthenticatedUser;
  setMobileOpen: (open: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b flex items-center justify-between px-4 lg:px-6 h-16 shrink-0" style={{ borderColor: "#DFE3E8" }}>
      <div className="flex items-center gap-3 min-w-0">
        <button className="lg:hidden p-2 -ml-2 text-gray-600 rounded transition-colors hover:bg-gray-100 hover:text-[#0B2545]" onClick={() => setMobileOpen(true)} aria-label="Buka menu">
          <Menu size={20} />
        </button>
        <h1 className="text-base lg:text-lg font-semibold text-gray-900 truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-800 leading-tight">{user.nama}</p>
          <p className="text-xs text-gray-500 leading-tight">{ROLE_LABEL[user.role]}</p>
        </div>
        <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ background: "#0B2545" }}>
          {user.nama.split(" ").map((name) => name[0]).slice(0, 2).join("")}
        </div>
      </div>
    </header>
  );
}
