import React, { useState, useMemo } from "react";
import {
  Scale, Building2, LayoutDashboard, FileText, PlusCircle, ClipboardList,
  Users, Settings, LogOut, Search, ChevronLeft, ChevronRight, X,
  CheckCircle2, Eye, Pencil, Calendar, Clock, MapPin, ShieldCheck,
  ArrowLeft, RotateCcw, Gavel, Mail, Lock, Menu, AlertCircle, Filter as FilterIcon
} from "lucide-react";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * PROTOTYPE NOTE
 * This is a single-file React simulation of the Next.js + TypeScript +
 * Tailwind + shadcn/ui application described in the brief. Client-side
 * state stands in for routing (Next.js App Router pages) and for
 * Supabase (mock arrays below). When wiring up the real app:
 *   - Each `case View...` block below becomes its own route/page file.
 *   - `CaseRecord` shape (documented in the comment above MOCK_CASES)
 *     becomes a TypeScript interface, e.g.:
 *       interface CaseRecord {
 *         id: string; nomorPerkara: string; namaTerdakwa: string;
 *         jenisPerkara: string; pengadilan: string; namaJaksa: string;
 *         namaHakim: string; tanggalPembacaan: string; waktuPembacaan: string;
 *         ruangSidang: string; catatan: string;
 *         status: "belum" | "sudah";
 *         createdAt: string; updatedAt: string;
 *       }
 *   - `cases` / `activityLog` state becomes Supabase table reads/writes.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ── Design tokens ───────────────────────────────────────────────────────
const NAVY = "#0B2545";
const NAVY_DARK = "#081B33";
const NAVY_LIGHT = "#13345F";
const ACCENT = "#1D4E89";
const BORDER = "#DFE3E8";

// ── Mock data ────────────────────────────────────────────────────────────
const COURTS = [
  "Pengadilan Negeri Jakarta Pusat", "Pengadilan Negeri Surabaya",
  "Pengadilan Negeri Medan", "Pengadilan Negeri Bandung",
  "Pengadilan Negeri Semarang", "Pengadilan Negeri Makassar",
  "Pengadilan Negeri Denpasar", "Pengadilan Negeri Palembang",
  "Pengadilan Negeri Yogyakarta", "Pengadilan Negeri Malang",
];

const CASE_TYPES = ["Pidana Umum", "Pidana Khusus - Narkotika", "Pidana Khusus - Korupsi"];

const MOCK_CASES = [
  { id: "1", nomorPerkara: "45/Pid.B/2026/PN Jkt.Pst", namaTerdakwa: "Ahmad Ridwan", jenisPerkara: "Pidana Umum", pengadilan: COURTS[0], namaJaksa: "Siti Nurhaliza, S.H.", namaHakim: "Dr. Bambang Wijaya, S.H., M.H.", tanggalPembacaan: "2026-09-04", waktuPembacaan: "09:00", ruangSidang: "Ruang Sidang I", catatan: "Pembacaan putusan tingkat pertama.", status: "belum", createdAt: "2026-08-20 10:00", updatedAt: "2026-08-20 10:00" },
  { id: "2", nomorPerkara: "112/Pid.Sus/2026/PN Sby", namaTerdakwa: "Joko Prasetyo", jenisPerkara: "Pidana Khusus - Narkotika", pengadilan: COURTS[1], namaJaksa: "Andi Firmansyah, S.H.", namaHakim: "Rina Kartika, S.H.", tanggalPembacaan: "2026-09-02", waktuPembacaan: "10:00", ruangSidang: "Ruang Sidang III", catatan: "", status: "sudah", createdAt: "2026-08-18 09:15", updatedAt: "2026-09-02 10:15" },
  { id: "3", nomorPerkara: "78/Pid.B/2026/PN Mdn", namaTerdakwa: "Dewi Lestari", jenisPerkara: "Pidana Umum", pengadilan: COURTS[2], namaJaksa: "Hendra Gunawan, S.H.", namaHakim: "Agus Santoso, S.H., M.H.", tanggalPembacaan: "2026-08-28", waktuPembacaan: "13:30", ruangSidang: "Ruang Sidang II", catatan: "", status: "sudah", createdAt: "2026-08-10 08:30", updatedAt: "2026-08-28 11:00" },
  { id: "4", nomorPerkara: "203/Pid.Sus-TPK/2026/PN Bdg", namaTerdakwa: "Rudi Hartono", jenisPerkara: "Pidana Khusus - Korupsi", pengadilan: COURTS[3], namaJaksa: "Maya Puspita, S.H.", namaHakim: "Wahyu Nugroho, S.H., M.H.", tanggalPembacaan: "2026-09-04", waktuPembacaan: "14:00", ruangSidang: "Ruang Sidang Tipikor", catatan: "Perkara mendapat perhatian media.", status: "belum", createdAt: "2026-08-22 11:00", updatedAt: "2026-08-22 11:00" },
  { id: "5", nomorPerkara: "56/Pid.B/2026/PN Smg", namaTerdakwa: "Sri Wahyuni", jenisPerkara: "Pidana Umum", pengadilan: COURTS[4], namaJaksa: "Fajar Ramadhan, S.H.", namaHakim: "Lestari Handayani, S.H.", tanggalPembacaan: "2026-09-10", waktuPembacaan: "09:30", ruangSidang: "Ruang Sidang I", catatan: "", status: "belum", createdAt: "2026-08-25 09:00", updatedAt: "2026-08-25 09:00" },
  { id: "6", nomorPerkara: "91/Pid.Sus/2026/PN Mks", namaTerdakwa: "Muhammad Yusuf", jenisPerkara: "Pidana Khusus - Narkotika", pengadilan: COURTS[5], namaJaksa: "Putri Amelia, S.H.", namaHakim: "Iwan Setiawan, S.H., M.H.", tanggalPembacaan: "2026-08-25", waktuPembacaan: "10:30", ruangSidang: "Ruang Sidang II", catatan: "", status: "sudah", createdAt: "2026-08-05 10:00", updatedAt: "2026-08-25 11:05" },
  { id: "7", nomorPerkara: "134/Pid.B/2026/PN Dps", namaTerdakwa: "I Made Suarta", jenisPerkara: "Pidana Umum", pengadilan: COURTS[6], namaJaksa: "Kadek Wirawan, S.H.", namaHakim: "Ni Luh Sari, S.H.", tanggalPembacaan: "2026-09-06", waktuPembacaan: "11:00", ruangSidang: "Ruang Sidang I", catatan: "", status: "belum", createdAt: "2026-08-27 08:45", updatedAt: "2026-08-27 08:45" },
  { id: "8", nomorPerkara: "67/Pid.Sus-TPK/2026/PN Plg", namaTerdakwa: "Bambang Sutrisno", jenisPerkara: "Pidana Khusus - Korupsi", pengadilan: COURTS[7], namaJaksa: "Rian Saputra, S.H.", namaHakim: "Dian Permata, S.H., M.H.", tanggalPembacaan: "2026-08-30", waktuPembacaan: "13:00", ruangSidang: "Ruang Sidang Tipikor", catatan: "", status: "sudah", createdAt: "2026-08-12 09:00", updatedAt: "2026-08-30 13:40" },
  { id: "9", nomorPerkara: "189/Pid.B/2026/PN Yyk", namaTerdakwa: "Fitriani Rahma", jenisPerkara: "Pidana Umum", pengadilan: COURTS[8], namaJaksa: "Bayu Aji, S.H.", namaHakim: "Sari Wulandari, S.H.", tanggalPembacaan: "2026-09-04", waktuPembacaan: "09:00", ruangSidang: "Ruang Sidang III", catatan: "", status: "belum", createdAt: "2026-09-01 14:20", updatedAt: "2026-09-01 14:20" },
  { id: "10", nomorPerkara: "22/Pid.Sus/2026/PN Mlg", namaTerdakwa: "Agus Salim", jenisPerkara: "Pidana Khusus - Narkotika", pengadilan: COURTS[9], namaJaksa: "Nadia Kusuma, S.H.", namaHakim: "Eko Prabowo, S.H., M.H.", tanggalPembacaan: "2026-09-01", waktuPembacaan: "10:00", ruangSidang: "Ruang Sidang I", catatan: "", status: "sudah", createdAt: "2026-08-15 10:30", updatedAt: "2026-09-01 10:50" },
];

const MOCK_ACTIVITY = [
  { id: "a1", user: "Budi Santoso", action: "Mengubah status", caseNumber: "112/Pid.Sus/2026/PN Sby", previousValue: "Belum Dibacakan", newValue: "Sudah Dibacakan", date: "2026-09-02", time: "10:15" },
  { id: "a2", user: "Siti Aminah", action: "Menambahkan jadwal", caseNumber: "189/Pid.B/2026/PN Yyk", previousValue: "-", newValue: "Belum Dibacakan", date: "2026-09-01", time: "14:20" },
  { id: "a3", user: "Budi Santoso", action: "Mengubah status", caseNumber: "78/Pid.B/2026/PN Mdn", previousValue: "Belum Dibacakan", newValue: "Sudah Dibacakan", date: "2026-08-28", time: "11:00" },
];

const MOCK_USERS = [
  { id: "u1", name: "Andi Prasetya", email: "andi.prasetya@sipp.go.id", role: "admin", instansi: "Sekretariat Sistem" },
  { id: "u2", name: "Budi Santoso", email: "budi.santoso@pn-jakpus.go.id", role: "pengadilan", instansi: "PN Jakarta Pusat" },
  { id: "u3", name: "Rina Kartika", email: "rina.kartika@pn-surabaya.go.id", role: "pengadilan", instansi: "PN Surabaya" },
  { id: "u4", name: "Siti Rahayu", email: "siti.rahayu@kejaksaan.go.id", role: "kejaksaan", instansi: "Kejaksaan Negeri Jakarta Pusat" },
  { id: "u5", name: "Fajar Ramadhan", email: "fajar.ramadhan@kejaksaan.go.id", role: "kejaksaan", instansi: "Kejaksaan Negeri Semarang" },
];

const ROLE_LABEL = { admin: "Admin", pengadilan: "Pengadilan", kejaksaan: "Kejaksaan" };
const TODAY = "2026-09-04";

function formatTanggal(iso) {
  if (!iso) return "-";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

// ── Reusable: StatusBadge ───────────────────────────────────────────────
function StatusBadge({ status, size = "md" }) {
  const isSudah = status === "sudah";
  const pad = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded ${pad} font-medium border`}
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

// ── Reusable: DashboardStatCard ─────────────────────────────────────────
function DashboardStatCard({ label, value, icon: Icon, tone }) {
  const tones = {
    neutral: { bg: "#F3F5F8", fg: NAVY },
    red: { bg: "#FDECEC", fg: "#B91C1C" },
    green: { bg: "#EAF7EE", fg: "#15803D" },
    blue: { bg: "#EAF1FB", fg: ACCENT },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <div className="bg-white border rounded-md p-4 flex items-center gap-4" style={{ borderColor: BORDER }}>
      <div className="h-11 w-11 rounded-md flex items-center justify-center shrink-0" style={{ background: t.bg }}>
        <Icon size={20} color={t.fg} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-gray-900 leading-tight">{value}</p>
        <p className="text-sm text-gray-500 truncate">{label}</p>
      </div>
    </div>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────
function Sidebar({ role, view, onNavigate, mobileOpen, setMobileOpen }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
    { key: "cases", label: "Semua Perkara", icon: FileText, show: true, group: "Perkara" },
    { key: "add", label: "Tambah Pembacaan", icon: PlusCircle, show: role === "admin" || role === "pengadilan", group: "Perkara" },
    { key: "activity", label: "Activity Log", icon: ClipboardList, show: role === "admin" },
    { key: "users", label: "User Management", icon: Users, show: role === "admin" },
    { key: "settings", label: "Settings", icon: Settings, show: true },
  ];

  const NavButton = ({ item }) => (
    <button
      onClick={() => { onNavigate(item.key); setMobileOpen(false); }}
      className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors"
      style={{
        background: view === item.key ? NAVY_LIGHT : "transparent",
        color: view === item.key ? "#FFFFFF" : "#B7C4D8",
      }}
      onMouseEnter={(e) => { if (view !== item.key) e.currentTarget.style.background = NAVY_DARK; }}
      onMouseLeave={(e) => { if (view !== item.key) e.currentTarget.style.background = "transparent"; }}
    >
      <item.icon size={17} />
      <span>{item.label}</span>
    </button>
  );

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-40 flex flex-col shrink-0 transition-transform
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ background: NAVY }}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: NAVY_LIGHT }}>
          <div className="h-9 w-9 rounded-md bg-white/10 flex items-center justify-center shrink-0">
            <Scale size={18} color="#FFFFFF" />
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-white text-sm font-semibold truncate">SIMPP</p>
            <p className="text-[11px] text-[#93A5C2] truncate">Monitoring Pembacaan Perkara</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          <div className="space-y-1">
            <NavButton item={items[0]} />
          </div>
          <div>
            <p className="px-3 text-[11px] font-medium text-[#6C81A3] mb-1.5">Perkara</p>
            <div className="space-y-1">
              {items.filter((i) => i.group === "Perkara" && i.show).map((i) => <NavButton key={i.key} item={i} />)}
            </div>
          </div>
          {(role === "admin") && (
            <div>
              <p className="px-3 text-[11px] font-medium text-[#6C81A3] mb-1.5">Administrasi</p>
              <div className="space-y-1">
                <NavButton item={items[3]} />
                <NavButton item={items[4]} />
              </div>
            </div>
          )}
          <div className="space-y-1">
            <NavButton item={items[5]} />
          </div>
        </nav>

        <div className="px-3 py-4 border-t" style={{ borderColor: NAVY_LIGHT }}>
          <button
            onClick={() => onNavigate("logout")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-[#B7C4D8] hover:bg-[#081B33]"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Header ───────────────────────────────────────────────────────────────
function Header({ title, user, setMobileOpen }) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b flex items-center justify-between px-4 lg:px-6 h-16 shrink-0" style={{ borderColor: BORDER }}>
      <div className="flex items-center gap-3 min-w-0">
        <button className="lg:hidden p-2 -ml-2 text-gray-600" onClick={() => setMobileOpen(true)}>
          <Menu size={20} />
        </button>
        <h1 className="text-base lg:text-lg font-semibold text-gray-900 truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-800 leading-tight">{user.name}</p>
          <p className="text-xs text-gray-500 leading-tight">{ROLE_LABEL[user.role]}</p>
        </div>
        <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ background: NAVY }}>
          {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </div>
      </div>
    </header>
  );
}

// ── SearchAndFilters ─────────────────────────────────────────────────────
function SearchAndFilters({ filters, setFilters, onReset }) {
  const set = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));
  const inputCls = "w-full border rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1D4E89]/30 focus:border-[#1D4E89]";
  const months = ["Semua Bulan", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  return (
    <div className="bg-white border rounded-md p-4" style={{ borderColor: BORDER }}>
      <div className="flex items-center gap-2 mb-3 text-gray-700">
        <FilterIcon size={16} />
        <span className="text-sm font-medium">Pencarian &amp; Filter</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative lg:col-span-2">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className={inputCls + " pl-9"}
            placeholder="Cari no. perkara atau nama terdakwa..."
            value={filters.q}
            onChange={set("q")}
          />
        </div>
        <select className={inputCls} value={filters.status} onChange={set("status")}>
          <option value="">Semua Status</option>
          <option value="belum">Belum Dibacakan</option>
          <option value="sudah">Sudah Dibacakan</option>
        </select>
        <input type="date" className={inputCls} value={filters.tanggal} onChange={set("tanggal")} />
        <select className={inputCls} value={filters.pengadilan} onChange={set("pengadilan")}>
          <option value="">Semua Pengadilan</option>
          {COURTS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className={inputCls} value={filters.bulan} onChange={set("bulan")}>
          {months.map((m, i) => <option key={m} value={i === 0 ? "" : String(i)}>{m}</option>)}
        </select>
        <select className={inputCls} value={filters.tahun} onChange={set("tahun")}>
          <option value="">Semua Tahun</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 border rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          style={{ borderColor: BORDER }}
        >
          <RotateCcw size={14} /> Reset Filter
        </button>
      </div>
    </div>
  );
}

// ── CaseTable ────────────────────────────────────────────────────────────
function CaseTable({ rows, page, setPage, pageSize, total, onView, onMark, canMark }) {
  const cols = ["No.", "No. Perkara", "Nama Terdakwa", "Tanggal Pembacaan", "Pengadilan", "Jaksa", "Status", "Aksi"];
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="bg-white border rounded-md overflow-hidden" style={{ borderColor: BORDER }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b" style={{ borderColor: BORDER, background: "#FAFBFC" }}>
              {cols.map((c) => <th key={c} className="px-4 py-3 font-medium whitespace-nowrap">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">Tidak ada data yang cocok dengan filter.</td></tr>
            )}
            {rows.map((c, idx) => (
              <tr
                key={c.id}
                className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                style={{ borderColor: BORDER }}
                onClick={() => onView(c.id)}
              >
                <td className="px-4 py-3 text-gray-500">{(page - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{c.nomorPerkara}</td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{c.namaTerdakwa}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatTanggal(c.tanggalPembacaan)}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.pengadilan}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.namaJaksa}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} size="sm" /></td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <button
                      onClick={() => onView(c.id)}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded border text-gray-600 hover:bg-gray-50"
                      style={{ borderColor: BORDER }}
                    >
                      <Eye size={13} /> Detail
                    </button>
                    {canMark && c.status === "belum" && (
                      <button
                        onClick={() => onMark(c.id)}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded text-white"
                        style={{ background: "#15803D" }}
                      >
                        <CheckCircle2 size={13} /> Tandai
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-500" style={{ borderColor: BORDER }}>
        <span>Menampilkan {rows.length ? (page - 1) * pageSize + 1 : 0}–{(page - 1) * pageSize + rows.length} dari {total} data</span>
        <div className="flex items-center gap-1">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded border disabled:opacity-40"
            style={{ borderColor: BORDER }}
          >
            <ChevronLeft size={15} />
          </button>
          <span className="px-2">{page} / {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded border disabled:opacity-40"
            style={{ borderColor: BORDER }}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ConfirmationModal ────────────────────────────────────────────────────
function ConfirmationModal({ open, onConfirm, onCancel, caseNumber }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-md w-full max-w-sm p-6 border" style={{ borderColor: BORDER }}>
        <div className="h-11 w-11 rounded-full flex items-center justify-center mb-4" style={{ background: "#EAF7EE" }}>
          <CheckCircle2 size={22} color="#15803D" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1.5">Konfirmasi Pembacaan</h3>
        <p className="text-sm text-gray-600 mb-1">Apakah Anda yakin perkara ini sudah dibacakan?</p>
        <p className="text-sm font-medium text-gray-800 mb-5">{caseNumber}</p>
        <div className="flex items-center gap-2 justify-end">
          <button onClick={onCancel} className="px-3.5 py-2 rounded border text-sm text-gray-600 hover:bg-gray-50" style={{ borderColor: BORDER }}>
            Batal
          </button>
          <button onClick={onConfirm} className="px-3.5 py-2 rounded text-sm text-white" style={{ background: "#15803D" }}>
            Ya, Sudah Dibacakan
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CaseForm (Add + Edit) ────────────────────────────────────────────────
function CaseForm({ initial, onCancel, onSave, submitLabel = "Simpan" }) {
  const empty = {
    nomorPerkara: "", namaTerdakwa: "", jenisPerkara: CASE_TYPES[0], pengadilan: COURTS[0],
    namaJaksa: "", namaHakim: "", tanggalPembacaan: "", waktuPembacaan: "", ruangSidang: "", catatan: "",
  };
  const [form, setForm] = useState(initial ? { ...empty, ...initial } : empty);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const required = ["nomorPerkara", "namaTerdakwa", "pengadilan", "namaJaksa", "namaHakim", "tanggalPembacaan", "waktuPembacaan", "ruangSidang"];

  function validate() {
    const errs = {};
    required.forEach((k) => { if (!String(form[k] || "").trim()) errs[k] = "Wajib diisi"; });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (validate()) onSave(form);
  }

  const inputCls = (k) =>
    `w-full border rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1D4E89]/30 focus:border-[#1D4E89] ${errors[k] ? "border-red-400" : ""}`;

  const Field = ({ label, k, children, full }) => (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-sm text-gray-700 mb-1.5">{label} <span className="text-red-500">*</span></label>
      {children}
      {errors[k] && <p className="text-xs text-red-600 mt-1">{errors[k]}</p>}
    </div>
  );

  return (
    <div className="bg-white border rounded-md p-5 sm:p-6 space-y-5" style={{ borderColor: BORDER }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nomor Perkara" k="nomorPerkara">
          <input className={inputCls("nomorPerkara")} value={form.nomorPerkara} onChange={set("nomorPerkara")} placeholder="mis. 45/Pid.B/2026/PN Jkt.Pst" />
        </Field>
        <Field label="Nama Terdakwa" k="namaTerdakwa">
          <input className={inputCls("namaTerdakwa")} value={form.namaTerdakwa} onChange={set("namaTerdakwa")} />
        </Field>
        <div>
          <label className="block text-sm text-gray-700 mb-1.5">Jenis Perkara</label>
          <select className={inputCls("jenisPerkara")} value={form.jenisPerkara} onChange={set("jenisPerkara")}>
            {CASE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Field label="Pengadilan" k="pengadilan">
          <select className={inputCls("pengadilan")} value={form.pengadilan} onChange={set("pengadilan")}>
            {COURTS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Nama Jaksa" k="namaJaksa">
          <input className={inputCls("namaJaksa")} value={form.namaJaksa} onChange={set("namaJaksa")} placeholder="mis. Siti Nurhaliza, S.H." />
        </Field>
        <Field label="Nama Hakim" k="namaHakim">
          <input className={inputCls("namaHakim")} value={form.namaHakim} onChange={set("namaHakim")} placeholder="mis. Dr. Bambang Wijaya, S.H., M.H." />
        </Field>
        <Field label="Tanggal Pembacaan" k="tanggalPembacaan">
          <input type="date" className={inputCls("tanggalPembacaan")} value={form.tanggalPembacaan} onChange={set("tanggalPembacaan")} />
        </Field>
        <Field label="Waktu Pembacaan" k="waktuPembacaan">
          <input type="time" className={inputCls("waktuPembacaan")} value={form.waktuPembacaan} onChange={set("waktuPembacaan")} />
        </Field>
        <Field label="Ruang Sidang" k="ruangSidang">
          <input className={inputCls("ruangSidang")} value={form.ruangSidang} onChange={set("ruangSidang")} placeholder="mis. Ruang Sidang I" />
        </Field>
        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-700 mb-1.5">Catatan</label>
          <textarea rows={3} className={inputCls("catatan")} value={form.catatan} onChange={set("catatan")} placeholder="Catatan tambahan (opsional)" />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: BORDER }}>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border text-sm text-gray-600 hover:bg-gray-50" style={{ borderColor: BORDER }}>
          Batal
        </button>
        <button type="button" onClick={handleSubmit} className="px-4 py-2 rounded text-sm text-white" style={{ background: NAVY }}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

// ── Login Page ───────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");

  function submit() {
    if (!email.trim() || !password.trim()) { setError("Email dan kata sandi wajib diisi."); return; }
    const user = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
    onLogin({ name: user.name, role: user.role, instansi: user.instansi });
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") submit();
  }

  const inputCls = "w-full border rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1D4E89]/30 focus:border-[#1D4E89]";

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F3F5F8" }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-full flex items-center justify-center mb-3" style={{ background: NAVY }}>
            <Scale size={26} color="#FFFFFF" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 text-center">Sistem Monitoring Pembacaan Perkara</h1>
          <p className="text-sm text-gray-500 text-center mt-1">Portal Pengadilan &amp; Kejaksaan</p>
        </div>

        <div className="bg-white border rounded-md p-6 space-y-4" style={{ borderColor: BORDER }}>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
              <AlertCircle size={15} /> {error}
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" className={inputCls + " pl-9"} placeholder="nama@instansi.go.id" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Kata Sandi</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" className={inputCls + " pl-9"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Masuk sebagai (mode demo)</label>
            <select className={inputCls} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="pengadilan">Pengadilan / Court Staff</option>
              <option value="kejaksaan">Kejaksaan / Prosecutor Staff</option>
            </select>
          </div>
          <button type="button" onClick={submit} className="w-full py-2.5 rounded text-sm font-medium text-white flex items-center justify-center gap-2" style={{ background: NAVY }}>
            <ShieldCheck size={15} /> Masuk
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">Prototipe — autentikasi belum terhubung ke basis data.</p>
      </div>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cases, setCases] = useState(MOCK_CASES);
  const [activityLog, setActivityLog] = useState(MOCK_ACTIVITY);
  const [selectedId, setSelectedId] = useState(null);
  const [editingDetail, setEditingDetail] = useState(false);
  const [confirmForId, setConfirmForId] = useState(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");
  const pageSize = 5;

  const [filters, setFilters] = useState({ q: "", status: "", tanggal: "", pengadilan: "", bulan: "", tahun: "" });
  function resetFilters() { setFilters({ q: "", status: "", tanggal: "", pengadilan: "", bulan: "", tahun: "" }); setPage(1); }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2800); }

  function markSudah(id) {
    const c = cases.find((x) => x.id === id);
    if (!c) return;
    const now = "04/09/2026 " + new Date().toTimeString().slice(0, 5);
    setCases((prev) => prev.map((x) => (x.id === id ? { ...x, status: "sudah", updatedAt: now } : x)));
    setActivityLog((prev) => [
      { id: "a" + Date.now(), user: user?.name || "-", action: "Mengubah status", caseNumber: c.nomorPerkara, previousValue: "Belum Dibacakan", newValue: "Sudah Dibacakan", date: "2026-09-04", time: new Date().toTimeString().slice(0, 5) },
      ...prev,
    ]);
    setConfirmForId(null);
    showToast(`Status ${c.nomorPerkara} diperbarui menjadi Sudah Dibacakan.`);
  }

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (!c.nomorPerkara.toLowerCase().includes(q) && !c.namaTerdakwa.toLowerCase().includes(q)) return false;
      }
      if (filters.status && c.status !== filters.status) return false;
      if (filters.tanggal && c.tanggalPembacaan !== filters.tanggal) return false;
      if (filters.pengadilan && c.pengadilan !== filters.pengadilan) return false;
      if (filters.bulan && String(Number(c.tanggalPembacaan.slice(5, 7))) !== filters.bulan) return false;
      if (filters.tahun && c.tanggalPembacaan.slice(0, 4) !== filters.tahun) return false;
      return true;
    });
  }, [cases, filters]);

  const pageRows = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page]);
  const stats = useMemo(() => ({
    total: cases.length,
    belum: cases.filter((c) => c.status === "belum").length,
    sudah: cases.filter((c) => c.status === "sudah").length,
    hariIni: cases.filter((c) => c.tanggalPembacaan === TODAY).length,
  }), [cases]);

  function navigate(key) {
    if (key === "logout") { setUser(null); setView("dashboard"); return; }
    if (key === "cases") { setView("dashboard"); return; }
    setEditingDetail(false);
    setView(key);
  }
  function openDetail(id) { setSelectedId(id); setEditingDetail(false); setView("detail"); }

  if (!user) return <LoginPage onLogin={(u) => { setUser(u); setView("dashboard"); }} />;

  const canManageCases = user.role === "pengadilan";
  const canAdd = user.role === "admin" || user.role === "pengadilan";
  const selected = cases.find((c) => c.id === selectedId);

  const titles = { dashboard: "Dashboard", detail: "Detail Perkara", add: "Tambah Jadwal Pembacaan", activity: "Activity Log", users: "User Management", settings: "Pengaturan" };

  return (
    <div className="min-h-screen flex" style={{ background: "#F3F5F8", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sidebar role={user.role} view={view} onNavigate={navigate} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header title={titles[view] || "Dashboard"} user={user} setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 lg:p-6 space-y-5">
          {toast && (
            <div className="flex items-center gap-2 bg-[#EAF7EE] border border-[#BEE7C7] text-[#166534] text-sm rounded px-4 py-2.5">
              <CheckCircle2 size={15} /> {toast}
            </div>
          )}

          {view === "dashboard" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardStatCard label="Total Pembacaan" value={stats.total} icon={FileText} tone="blue" />
                <DashboardStatCard label="Belum Dibacakan" value={stats.belum} icon={Gavel} tone="red" />
                <DashboardStatCard label="Sudah Dibacakan" value={stats.sudah} icon={CheckCircle2} tone="green" />
                <DashboardStatCard label="Pembacaan Hari Ini" value={stats.hariIni} icon={Calendar} tone="neutral" />
              </div>

              <SearchAndFilters filters={filters} setFilters={(f) => { setFilters(f); setPage(1); }} onReset={resetFilters} />

              <CaseTable
                rows={pageRows}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                total={filtered.length}
                onView={openDetail}
                onMark={(id) => setConfirmForId(id)}
                canMark={canManageCases}
              />
            </>
          )}

          {view === "add" && canAdd && (
            <CaseForm
              onCancel={() => navigate("dashboard")}
              onSave={(form) => {
                const now = "04/09/2026 " + new Date().toTimeString().slice(0, 5);
                const newCase = { ...form, id: String(Date.now()), status: "belum", createdAt: now, updatedAt: now };
                setCases((prev) => [newCase, ...prev]);
                setActivityLog((prev) => [
                  { id: "a" + Date.now(), user: user.name, action: "Menambahkan jadwal", caseNumber: form.nomorPerkara, previousValue: "-", newValue: "Belum Dibacakan", date: "2026-09-04", time: new Date().toTimeString().slice(0, 5) },
                  ...prev,
                ]);
                showToast(`Jadwal pembacaan ${form.nomorPerkara} berhasil ditambahkan.`);
                navigate("dashboard");
              }}
            />
          )}

          {view === "detail" && selected && (
            <div className="max-w-3xl space-y-4">
              <button onClick={() => navigate("dashboard")} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft size={15} /> Kembali ke Semua Perkara
              </button>

              {!editingDetail ? (
                <div className="bg-white border rounded-md" style={{ borderColor: BORDER }}>
                  <div className="flex flex-wrap items-start justify-between gap-3 px-6 py-5 border-b" style={{ borderColor: BORDER }}>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nomor Perkara</p>
                      <h2 className="text-lg font-semibold text-gray-900">{selected.nomorPerkara}</h2>
                    </div>
                    <StatusBadge status={selected.status} />
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 px-6 py-5 text-sm">
                    {[
                      ["Nama Terdakwa", selected.namaTerdakwa],
                      ["Jenis Perkara", selected.jenisPerkara],
                      ["Pengadilan", selected.pengadilan],
                      ["Nama Jaksa", selected.namaJaksa],
                      ["Nama Hakim", selected.namaHakim],
                      ["Tanggal Pembacaan", formatTanggal(selected.tanggalPembacaan)],
                      ["Waktu Pembacaan", selected.waktuPembacaan],
                      ["Ruang Sidang", selected.ruangSidang],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <dt className="text-gray-500 mb-0.5">{label}</dt>
                        <dd className="text-gray-800 font-medium">{val || "-"}</dd>
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <dt className="text-gray-500 mb-0.5">Catatan</dt>
                      <dd className="text-gray-800">{selected.catatan || "—"}</dd>
                    </div>
                  </dl>

                  <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t text-xs text-gray-400" style={{ borderColor: BORDER }}>
                    <span>Dibuat: {selected.createdAt}</span>
                    <span>Terakhir diperbarui: {selected.updatedAt}</span>
                  </div>

                  {canManageCases && (
                    <div className="flex items-center gap-2 px-6 py-4 border-t" style={{ borderColor: BORDER }}>
                      <button onClick={() => setEditingDetail(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border text-sm text-gray-700 hover:bg-gray-50" style={{ borderColor: BORDER }}>
                        <Pencil size={14} /> Edit
                      </button>
                      {selected.status === "belum" && (
                        <button onClick={() => setConfirmForId(selected.id)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded text-sm text-white" style={{ background: "#15803D" }}>
                          <CheckCircle2 size={14} /> Tandai Sudah Dibacakan
                        </button>
                      )}
                    </div>
                  )}
                  {user.role === "kejaksaan" && (
                    <div className="px-6 py-3 border-t text-xs text-gray-400" style={{ borderColor: BORDER }}>
                      Halaman ini bersifat baca-saja untuk peran Kejaksaan.
                    </div>
                  )}
                </div>
              ) : (
                <CaseForm
                  initial={selected}
                  submitLabel="Simpan Perubahan"
                  onCancel={() => setEditingDetail(false)}
                  onSave={(form) => {
                    const now = "04/09/2026 " + new Date().toTimeString().slice(0, 5);
                    setCases((prev) => prev.map((c) => (c.id === selected.id ? { ...c, ...form, updatedAt: now } : c)));
                    setEditingDetail(false);
                    showToast(`Data ${form.nomorPerkara} berhasil diperbarui.`);
                  }}
                />
              )}
            </div>
          )}

          {view === "activity" && user.role === "admin" && (
            <div className="bg-white border rounded-md overflow-hidden" style={{ borderColor: BORDER }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b" style={{ borderColor: BORDER, background: "#FAFBFC" }}>
                      {["Pengguna", "Aksi", "No. Perkara", "Nilai Sebelumnya", "Nilai Baru", "Tanggal", "Waktu"].map((h) => (
                        <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activityLog.map((a) => (
                      <tr key={a.id} className="border-b last:border-0" style={{ borderColor: BORDER }}>
                        <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{a.user}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.action}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.caseNumber}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{a.previousValue}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{a.newValue}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatTanggal(a.date)}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{a.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === "users" && user.role === "admin" && (
            <div className="bg-white border rounded-md overflow-hidden" style={{ borderColor: BORDER }}>
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
                <p className="text-sm text-gray-500">{MOCK_USERS.length} pengguna terdaftar</p>
                <button onClick={() => showToast("Formulir tambah pengguna belum terhubung ke basis data.")} className="text-sm px-3.5 py-2 rounded text-white" style={{ background: NAVY }}>
                  + Tambah Pengguna
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b" style={{ borderColor: BORDER, background: "#FAFBFC" }}>
                      {["Nama", "Email", "Instansi", "Peran"].map((h) => <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_USERS.map((u) => (
                      <tr key={u.id} className="border-b last:border-0" style={{ borderColor: BORDER }}>
                        <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{u.name}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{u.email}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{u.instansi}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded border" style={{ borderColor: BORDER, background: "#F3F5F8" }}>{ROLE_LABEL[u.role]}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === "settings" && (
            <div className="max-w-lg bg-white border rounded-md p-6 space-y-4" style={{ borderColor: BORDER }}>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Nama</label>
                <input disabled value={user.name} className="w-full border rounded px-3 py-2 text-sm text-gray-500 bg-gray-50" style={{ borderColor: BORDER }} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Peran</label>
                <input disabled value={ROLE_LABEL[user.role]} className="w-full border rounded px-3 py-2 text-sm text-gray-500 bg-gray-50" style={{ borderColor: BORDER }} />
              </div>
              <p className="text-xs text-gray-400 pt-2 border-t" style={{ borderColor: BORDER }}>Pengaturan akun akan tersedia setelah sistem terhubung ke basis data.</p>
            </div>
          )}
        </main>
      </div>

      <ConfirmationModal
        open={!!confirmForId}
        caseNumber={cases.find((c) => c.id === confirmForId)?.nomorPerkara}
        onCancel={() => setConfirmForId(null)}
        onConfirm={() => markSudah(confirmForId)}
      />
    </div>
  );
}
