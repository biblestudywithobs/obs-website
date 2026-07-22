import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database";

export type EventListItem = {
  id: string;
  title: string;
  startsAt: string;
  location: string;
  status: Enums<"content_status">;
};

export async function listEvents(): Promise<EventListItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("id, title, starts_at, location, status")
    .order("starts_at", { ascending: false });

  return (data ?? []).map((e) => ({
    id: e.id,
    title: e.title,
    startsAt: e.starts_at,
    location: e.location,
    status: e.status,
  }));
}

export type EventDetail = {
  id: string;
  slug: string;
  title: string;
  startsAt: string;
  location: string;
  description: string | null;
  registerUrl: string | null;
  flyerUrl: string | null;
  status: Enums<"content_status">;
};

export async function getEventById(id: string): Promise<EventDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("id, slug, title, starts_at, location, description, register_url, flyer_url, status")
    .eq("id", id)
    .single();

  if (!data) return null;
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    startsAt: data.starts_at,
    location: data.location,
    description: data.description,
    registerUrl: data.register_url,
    flyerUrl: data.flyer_url,
    status: data.status,
  };
}
