"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Pencil } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import CaseForm from "@/components/CaseForm";
import ConfirmationModal from "@/components/ConfirmationModal";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { AuthenticatedUser, CaseInput, CaseRecord } from "@/lib/types";

const formatDate = (value: string) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-";

export default function CaseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [item, setItem] = useState<CaseRecord | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.replace("/login");
          return;
        }
        setUser(currentUser);
        const { data, error: caseError } = await supabase.from("cases").select("*").eq("id", params.id).single();
        if (caseError) throw caseError;
        setItem(data as CaseRecord);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Data perkara gagal dimuat.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [params.id, router]);

  async function save(form: CaseInput) {
    if (!item) return;
    const updatedAt = new Date().toISOString();
    const { data, error: updateError } = await supabase.from("cases").update({ ...form, updated_at: updatedAt }).eq("id", item.id).select("*").single();
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setItem(data as CaseRecord);
    setEditing(false);
    setMessage(`Data ${form.nomor_perkara} berhasil diperbarui.`);
  }

  async function markSudah() {
    if (!item || !user) return;
    const updatedAt = new Date().toISOString();
    const { error: updateError } = await supabase.from("cases").update({ status: "sudah", updated_at: updatedAt }).eq("id", item.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    const { error: activityError } = await supabase.from("activity_log").insert({ user_name: user.nama, action: "Mengubah status", case_number: item.nomor_perkara, previous_value: "Belum Dibacakan", new_value: "Sudah Dibacakan" });
    if (activityError) {
      setError(activityError.message);
      return;
    }
    setItem({ ...item, status: "sudah", updated_at: updatedAt });
    setConfirmOpen(false);
    setMessage(`Status ${item.nomor_perkara} diperbarui menjadi Sudah Dibacakan.`);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Memuat perkara...</div>;
  if (!user || !item) return <div className="min-h-screen flex items-center justify-center text-sm text-red-700">{error || "Perkara tidak ditemukan."}</div>;

  const canManage = user.role === "pengadilan";
  const details: [string, string | null][] = [
    ["Nama Terdakwa", item.nama_terdakwa], ["Jenis Perkara", item.jenis_perkara], ["Pengadilan", item.pengadilan],
    ["Nama Jaksa", item.nama_jaksa], ["Nama Hakim", item.nama_hakim], ["Tanggal Pembacaan", formatDate(item.tanggal_pembacaan)],
    ["Waktu Pembacaan", item.waktu_pembacaan], ["Ruang Sidang", item.ruang_sidang],
  ];

  return <div className="min-h-screen flex" style={{ background: "#F3F5F8", fontFamily: "Inter, system-ui, sans-serif" }}>
    <Sidebar role={user.role} view="cases" onNavigate={(key) => router.push(key === "cases" ? "/cases" : `/${key}`)} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
    <div className="flex-1 min-w-0 flex flex-col"><Header title="Detail Perkara" user={user} setMobileOpen={setMobileOpen} /><main className="flex-1 p-4 lg:p-6 space-y-5">
      {message && <div className="flex items-center gap-2 bg-[#EAF7EE] border border-[#BEE7C7] text-[#166534] text-sm rounded px-4 py-2.5"><CheckCircle2 size={15} /> {message}</div>}
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
      <div className="max-w-3xl space-y-4"><button onClick={() => router.push("/dashboard")} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft size={15} /> Kembali ke Semua Perkara</button>
        {editing ? <CaseForm initial={item} submitLabel="Simpan Perubahan" onCancel={() => setEditing(false)} onSave={(form) => void save(form)} /> : <div className="bg-white border rounded-md" style={{ borderColor: "#DFE3E8" }}>
          <div className="flex flex-wrap items-start justify-between gap-3 px-6 py-5 border-b" style={{ borderColor: "#DFE3E8" }}><div><p className="text-xs text-gray-500 mb-1">Nomor Perkara</p><h2 className="text-lg font-semibold text-gray-900">{item.nomor_perkara}</h2></div><span className={`px-3 py-1 rounded text-sm font-medium ${item.status === "sudah" ? "bg-[#EAF7EE] text-[#166534]" : "bg-[#FDECEC] text-[#991B1B]"}`}>{item.status === "sudah" ? "Sudah Dibacakan" : "Belum Dibacakan"}</span></div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 px-6 py-5 text-sm">{details.map(([label, value]) => <div key={label}><dt className="text-gray-500 mb-0.5">{label}</dt><dd className="text-gray-800 font-medium">{value || "-"}</dd></div>)}<div className="sm:col-span-2"><dt className="text-gray-500 mb-0.5">Catatan</dt><dd className="text-gray-800">{item.catatan || "—"}</dd></div></dl>
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t text-xs text-gray-400" style={{ borderColor: "#DFE3E8" }}><span>Dibuat: {item.created_at}</span><span>Terakhir diperbarui: {item.updated_at}</span></div>
          {canManage && <div className="flex items-center gap-2 px-6 py-4 border-t" style={{ borderColor: "#DFE3E8" }}><button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border text-sm text-gray-700" style={{ borderColor: "#DFE3E8" }}><Pencil size={14} /> Edit</button>{item.status === "belum" && <button onClick={() => setConfirmOpen(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded text-sm text-white bg-[#15803D]"><CheckCircle2 size={14} /> Tandai Sudah Dibacakan</button>}</div>}
          {user.role === "kejaksaan" && <div className="px-6 py-3 border-t text-xs text-gray-400" style={{ borderColor: "#DFE3E8" }}>Halaman ini bersifat baca-saja untuk peran Kejaksaan.</div>}
        </div>}
      </div>
    </main></div>
    <ConfirmationModal open={confirmOpen} caseNumber={item.nomor_perkara} onCancel={() => setConfirmOpen(false)} onConfirm={() => void markSudah()} />
  </div>;
}
