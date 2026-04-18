import { supabase } from "../supabase-client"

function normalizeProfileValue(value) {
  return typeof value === "string" ? value.trim() : value ?? ""
}

export function buildProfilePayload(user, overrides = {}) {
  const metadata = user?.user_metadata ?? {}

  return {
    id: user?.id,
    name: normalizeProfileValue(overrides.name ?? metadata.name),
    username: normalizeProfileValue(overrides.username ?? metadata.username),
    email: normalizeProfileValue(
      overrides.email ?? user?.email ?? metadata.email,
    ).toLowerCase(),
    phone: normalizeProfileValue(overrides.phone ?? metadata.phone),
    address: normalizeProfileValue(overrides.address ?? metadata.address),
    dob: normalizeProfileValue(overrides.dob ?? metadata.dob),
  }
}

export async function ensureProfile(user, overrides = {}) {
  if (!user?.id) {
    return {
      data: null,
      error: new Error("Cannot sync profile without an authenticated user."),
    }
  }

  const payload = buildProfilePayload(user, overrides)

  return supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("id, name, username, email, phone, address, dob")
    .single()
}
