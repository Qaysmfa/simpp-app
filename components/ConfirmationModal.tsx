"use client";

import { CheckCircle2 } from "lucide-react";

export default function ConfirmationModal({ open, onConfirm, onCancel, caseNumber }: { open: boolean; onConfirm: () => void; onCancel: () => void; caseNumber?: string }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center px-4"><div className="absolute inset-0 bg-black/40" onClick={onCancel} /><div className="relative bg-white rounded-md w-full max-w-sm p-6 border" style={{ borderColor: "#DFE3E8" }}><div className="h-11 w-11 rounded-full flex items-center justify-center mb-4 bg-[#EAF7EE]"><CheckCircle2 size={22} color="#15803D" /></div><h3 className="text-base font-semibold text-gray-900 mb-1.5">Konfirmasi Pembacaan</h3><p className="text-sm text-gray-600 mb-1">Apakah Anda yakin perkara ini sudah dibacakan?</p><p className="text-sm font-medium text-gray-800 mb-5">{caseNumber}</p><div className="flex items-center gap-2 justify-end"><button onClick={onCancel} className="px-3.5 py-2 rounded border text-sm text-gray-600" style={{ borderColor: "#DFE3E8" }}>Batal</button><button onClick={onConfirm} className="px-3.5 py-2 rounded text-sm text-white bg-[#15803D]">Ya, Sudah Dibacakan</button></div></div></div>;
}

