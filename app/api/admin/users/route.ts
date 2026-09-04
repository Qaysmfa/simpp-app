import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import type { UserRole } from "@/lib/types";

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Sesi autentikasi tidak ditemukan." }, { status: 401 });
  }
  const authClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sesi autentikasi tidak valid." }, { status: 401 });
  }
  const { data: profile } = await authClient.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Hanya admin yang dapat membuat akun." }, { status: 403 });
  }

  if (!serviceRoleKey) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di server." }, { status: 500 });
  }

  const body = await request.json() as { email?: string; password?: string; name?: string; role?: UserRole };
  const email = body.email?.trim();
  const name = body.name?.trim();
  const password = body.password;
  const role = body.role;
  if (!email || !name || !password || !role || !["admin", "pengadilan", "kejaksaan"].includes(role) || password.length < 6) {
    return NextResponse.json({ error: "Nama, email, peran, dan kata sandi minimal 6 karakter wajib diisi." }, { status: 400 });
  }

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey);
  const { data, error: authError } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (authError || !data.user) {
    return NextResponse.json({ error: authError?.message ?? "Akun gagal dibuat." }, { status: 400 });
  }

  const { error: profileError } = await admin.from("profiles").insert({ id: data.user.id, name, role });
  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.user.id }, { status: 201 });
}
