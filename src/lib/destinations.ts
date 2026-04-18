import { supabase } from "../supabase-client"

const formatSupabaseError = (error: { message?: string; status?: number } | null) => {
  if (!error) return null
  const statusDetails = error.status ? ` [status=${error.status}]` : ""
  return `${error.message || "Supabase error"}${statusDetails}`
}

export const fetchDestinations = async () => {
  const response = await supabase
    .from("destinations")
    .select("*")
    .order("name", { ascending: true })

  const formattedError = formatSupabaseError(response.error || null)

  if (response.error) {
    console.error("Supabase fetchDestinations error:", response)
  }

  return {
    ...response,
    formattedError,
  }
}

export const fetchDestinationById = async (id: string | number) => {
  const response = await supabase
    .from("destinations")
    .select("*")
    .eq("id", id)
    .single()

  const formattedError = formatSupabaseError(response.error || null)

  if (response.error) {
    console.error("Supabase fetchDestinationById error:", response)
  }

  return {
    ...response,
    formattedError,
  }
}
