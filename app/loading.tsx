export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F3F5F8" }}>
      <div className="flex flex-col items-center gap-3 text-sm text-gray-500">
        <div className="h-9 w-9 rounded-full border-2 border-[#DFE3E8] border-t-[#1D4E89] animate-spin" />
        <span>Memuat halaman...</span>
      </div>
    </div>
  );
}

