"use client";

import { useState } from "react";
import { AlertCircle, Lock, Mail, Scale, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { signInWithPassword } from "@/lib/auth";

const NAVY = "#0B2545";
const BORDER = "#DFE3E8";
const inputClass =
  "w-full border rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1D4E89]/30 focus:border-[#1D4E89]";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.trim() || !password.trim()) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signInWithPassword(email.trim(), password);
      router.replace("/dashboard");
      router.refresh();
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : "Login gagal. Periksa email dan kata sandi Anda.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !loading) {
      void submit();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F3F5F8" }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-full flex items-center justify-center mb-3" style={{ background: NAVY }}>
            <Scale size={26} color="#FFFFFF" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 text-center">Monitoring Pembacaan Tuntutan, Putusan Pidana Mati, Seumur Hidup dan Penjara 20 Tahun dalam Perkara Narkotika</h1>
          <p className="text-sm text-gray-500 text-center mt-1">Portal Pengadilan &amp; Kejaksaan</p>
        </div>

        <div className="bg-white border rounded-md p-6 space-y-4" style={{ borderColor: BORDER }}>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-700 mb-1.5" htmlFor="email">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input id="email" type="email" autoComplete="email" className={`${inputClass} pl-9`} placeholder="nama@instansi.go.id" value={email} onChange={(event) => setEmail(event.target.value)} onKeyDown={handleKeyDown} />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5" htmlFor="password">Kata Sandi</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input id="password" type="password" autoComplete="current-password" className={`${inputClass} pl-9`} placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={handleKeyDown} />
            </div>
          </div>

          <button type="button" onClick={() => void submit()} disabled={loading} className="w-full py-2.5 rounded text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: NAVY }}>
            <ShieldCheck size={15} /> {loading ? "Memproses..." : "Masuk"}
          </button>
        </div>
      </div>
    </div>
  );
}
