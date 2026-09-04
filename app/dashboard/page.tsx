"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, CheckCircle2, FileText, Gavel } from "lucide-react";
import { useRouter } from "next/navigation";

import CaseTable from "@/components/CaseTable";
import ConfirmationModal from "@/components/ConfirmationModal";
import DashboardStatCard from "@/components/DashboardStatCard";
import Header from "@/components/Header";
import SearchAndFilters, { type CaseFilters } from "@/components/SearchAndFilters";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { AuthenticatedUser, CaseRecord } from "@/lib/types";

const TODAY = new Date().toISOString().slice(0, 10);
const EMPTY_FILTERS: CaseFilters = {
  q: "",
  status: "",
  tanggal: "",
  pengadilan: "",
  bulan: "",
  tahun: "",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [confirmFor, setConfirmFor] = useState<CaseRecord | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const pageSize = 5;

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.replace("/login");
          return;
        }
        setUser(currentUser);

        const { data, error: casesError } = await supabase
          .from("cases")
          .select("*")
          .order("tanggal_pembacaan", { ascending: true });
        if (casesError) throw casesError;
        setCases((data ?? []) as CaseRecord[]);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Data perkara gagal dimuat.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [router]);

  const filtered = useMemo(() => cases.filter((item) => {
    const query = filters.q.toLowerCase();
    if (query && !item.nomor_perkara.toLowerCase().includes(query) && !item.nama_terdakwa.toLowerCase().includes(query)) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.tanggal && item.tanggal_pembacaan !== filters.tanggal) return false;
    if (filters.pengadilan && item.pengadilan !== filters.pengadilan) return false;
    if (filters.bulan && String(Number(item.tanggal_pembacaan.slice(5, 7))) !== filters.bulan) return false;
    if (filters.tahun && item.tanggal_pembacaan.slice(0, 4) !== filters.tahun) return false;
    return true;
  }), [cases, filters]);

  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const stats = {
    total: cases.length,
    belum: cases.filter((item) => item.status === "belum").length,
    sudah: cases.filter((item) => item.status === "sudah").length,
    hariIni: cases.filter((item) => item.tanggal_pembacaan === TODAY).length,
  };

  async function markSudah() {
    if (!confirmFor || !user) return;
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("cases")
      .update({ status: "sudah", updated_at: now })
      .eq("id", confirmFor.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    const { error: activityError } = await supabase.from("activity_log").insert({
      user_name: user.nama,
      action: "Mengubah status",
      case_number: confirmFor.nomor_perkara,
      previous_value: "Belum Dibacakan",
      new_value: "Sudah Dibacakan",
    });
    if (activityError) {
      setError(activityError.message);
      return;
    }
    setCases((current) => current.map((item) => item.id === confirmFor.id ? { ...item, status: "sudah", updated_at: now } : item));
    setConfirmFor(null);
    setMessage(`Status ${confirmFor.nomor_perkara} diperbarui menjadi Sudah Dibacakan.`);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Memuat dashboard...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex" style={{ background: "#F3F5F8", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sidebar role={user.role} view="dashboard" onNavigate={(key) => router.push(key === "cases" ? "/dashboard" : `/${key}`)} mobileOpen={false} setMobileOpen={() => undefined} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header title="Dashboard" user={user} setMobileOpen={() => undefined} />
        <main className="flex-1 p-4 lg:p-6 space-y-5">
          {message && <div className="flex items-center gap-2 bg-[#EAF7EE] border border-[#BEE7C7] text-[#166534] text-sm rounded px-4 py-2.5"><CheckCircle2 size={15} /> {message}</div>}
          {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardStatCard label="Total Pembacaan" value={stats.total} icon={FileText} tone="blue" />
            <DashboardStatCard label="Belum Dibacakan" value={stats.belum} icon={Gavel} tone="red" />
            <DashboardStatCard label="Sudah Dibacakan" value={stats.sudah} icon={CheckCircle2} tone="green" />
            <DashboardStatCard label="Pembacaan Hari Ini" value={stats.hariIni} icon={Calendar} tone="neutral" />
          </div>
          <SearchAndFilters filters={filters} setFilters={(next) => { setFilters(next); setPage(1); }} onReset={() => { setFilters(EMPTY_FILTERS); setPage(1); }} />
          <CaseTable rows={rows} page={page} setPage={setPage} pageSize={pageSize} total={filtered.length} onView={(id) => router.push(`/cases/${id}`)} onMark={(id) => setConfirmFor(cases.find((item) => item.id === id) ?? null)} canMark={user.role === "pengadilan"} />
        </main>
      </div>
      <ConfirmationModal open={Boolean(confirmFor)} caseNumber={confirmFor?.nomor_perkara} onCancel={() => setConfirmFor(null)} onConfirm={() => void markSudah()} />
    </div>
  );
}
