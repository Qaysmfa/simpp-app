import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import type { AuthenticatedUser, Profile, UserRole } from "@/lib/types";

function profileFromRow(row: Record<string, unknown>, authUser: User): Profile {
  const role = row.role;

  if (role !== "admin" && role !== "pengadilan" && role !== "kejaksaan") {
    throw new Error("Profil pengguna memiliki peran yang tidak valid.");
  }

  const nama =
    typeof row.name === "string"
      ? row.name
      : typeof row.nama === "string"
        ? row.nama
        : "";

  if (!nama || !authUser.email) {
    throw new Error("Profil pengguna tidak lengkap.");
  }

  return {
    id: String(row.id ?? authUser.id),
    email: authUser.email,
    nama,
    role: role as UserRole,
    ...(typeof row.instansi === "string" ? { instansi: row.instansi } : {}),
  };
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<AuthenticatedUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("Autentikasi tidak mengembalikan pengguna.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  return {
    ...profileFromRow(profile as Record<string, unknown>, data.user),
    auth_id: data.user.id,
  };
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  return {
    ...profileFromRow(profile as Record<string, unknown>, user),
    auth_id: user.id,
  };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
