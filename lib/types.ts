export type UserRole = "admin" | "pengadilan" | "kejaksaan";
export type CaseStatus = "belum" | "sudah";

export interface CaseRecord {
  id: string;
  nomor_perkara: string;
  nama_terdakwa: string;
  jenis_perkara: string;
  pengadilan: string;
  nama_jaksa: string;
  nama_hakim: string;
  tanggal_pembacaan: string;
  waktu_pembacaan: string;
  ruang_sidang: string;
  catatan: string | null;
  status: CaseStatus;
  created_at: string;
  updated_at: string;
}

export type CaseInput = Omit<
  CaseRecord,
  "id" | "status" | "created_at" | "updated_at"
>;

export interface Profile {
  id: string;
  email: string;
  nama: string;
  role: UserRole;
  instansi?: string;
}

export interface ActivityLog {
  id: string;
  user_name: string;
  action: string;
  case_number: string | null;
  previous_value: string | null;
  new_value: string | null;
  created_at: string;
}

export interface AuthenticatedUser extends Profile {
  auth_id: string;
}

export const ROLE_LABEL: Record<UserRole, string> = {
  admin: "Admin",
  pengadilan: "Pengadilan",
  kejaksaan: "Kejaksaan",
};
