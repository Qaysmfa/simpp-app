"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CaseTable from "@/components/CaseTable";
import Header from "@/components/Header";
import SearchAndFilters, { type CaseFilters } from "@/components/SearchAndFilters";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { AuthenticatedUser, CaseRecord } from "@/lib/types";

const EMPTY_FILTERS: CaseFilters = { q: "", status: "", tanggal: "", pengadilan: "", bulan: "", tahun: "" };

export default function CasesPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Memuat perkara...</div>;
  if (!user) return null;

  return <div className="min-h-screen flex" style={{ background: "#F3F5F8" }}>
    <Sidebar role={user.role} view="cases" onNavigate={(key) => router.push(key === "cases" ? "/cases" : `/${key}`)} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
    <div className="flex-1 min-w-0"><Header title="Semua Perkara" user={user} setMobileOpen={setMobileOpen} /><main className="p-4 lg:p-6 space-y-5">
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
      <SearchAndFilters filters={filters} setFilters={(next) => { setFilters(next); setPage(1); }} onReset={() => { setFilters(EMPTY_FILTERS); setPage(1); }} />
      <CaseTable rows={filtered.slice((page - 1) * pageSize, page * pageSize)} page={page} setPage={setPage} pageSize={pageSize} total={filtered.length} onView={(id) => router.push(`/cases/${id}`)} onMark={() => undefined} canMark={false} />
    </main></div>
  </div>;
}

