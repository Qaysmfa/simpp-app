"use client";

import { Filter, RotateCcw, Search } from "lucide-react";

export interface CaseFilters {
  q: string;
  status: string;
  tanggal: string;
  pengadilan: string;
  bulan: string;
  tahun: string;
}

const COURTS = [
  "Pengadilan Negeri Jakarta Pusat", "Pengadilan Negeri Surabaya", "Pengadilan Negeri Medan",
  "Pengadilan Negeri Bandung", "Pengadilan Negeri Semarang", "Pengadilan Negeri Makassar",
  "Pengadilan Negeri Denpasar", "Pengadilan Negeri Palembang", "Pengadilan Negeri Yogyakarta",
  "Pengadilan Negeri Malang",
];
const months = ["Semua Bulan", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export default function SearchAndFilters({ filters, setFilters, onReset }: { filters: CaseFilters; setFilters: (filters: CaseFilters) => void; onReset: () => void }) {
  const set = (key: keyof CaseFilters) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFilters({ ...filters, [key]: event.target.value });
  const input = "w-full border rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1D4E89]/30 focus:border-[#1D4E89]";
  return <div className="bg-white border rounded-md p-4" style={{ borderColor: "#DFE3E8" }}>
    <div className="flex items-center gap-2 mb-3 text-gray-700"><Filter size={16} /><span className="text-sm font-medium">Pencarian &amp; Filter</span></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="relative lg:col-span-2"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input className={`${input} pl-9`} placeholder="Cari no. perkara atau nama terdakwa..." value={filters.q} onChange={set("q")} /></div>
      <select className={input} value={filters.status} onChange={set("status")}><option value="">Semua Status</option><option value="belum">Belum Dibacakan</option><option value="sudah">Sudah Dibacakan</option></select>
      <input type="date" className={input} value={filters.tanggal} onChange={set("tanggal")} />
      <select className={input} value={filters.pengadilan} onChange={set("pengadilan")}><option value="">Semua Pengadilan</option>{COURTS.map((court) => <option key={court}>{court}</option>)}</select>
      <select className={input} value={filters.bulan} onChange={set("bulan")}>{months.map((month, i) => <option key={month} value={i ? String(i) : ""}>{month}</option>)}</select>
      <select className={input} value={filters.tahun} onChange={set("tahun")}><option value="">Semua Tahun</option><option value="2026">2026</option><option value="2025">2025</option></select>
      <button onClick={onReset} className="flex items-center justify-center gap-2 border rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-50" style={{ borderColor: "#DFE3E8" }}><RotateCcw size={14} /> Reset Filter</button>
    </div>
  </div>;
}

