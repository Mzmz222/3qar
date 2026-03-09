import { createClient } from "@supabase/supabase-js";
import HomeClient from "./HomeClient";

export const revalidate = 3600;

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function HomePage() {
  const [propertiesResult, citiesResult, neighborhoodsResult, settingsResult] = await Promise.all([
    sb.from("properties")
      .select("*, cities(name), neighborhoods(name)")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .range(0, 11),
    sb.from("cities").select("*").order("name"),
    sb.from("neighborhoods").select("*").order("name"),
    sb.from("settings").select("*").limit(1).single(),
  ]);

  // Get total count
  const { count } = await sb.from("properties").select("*", { count: "exact", head: true });

  return (
    <HomeClient
      initialProperties={propertiesResult.data || []}
      initialCount={count || 0}
      cities={citiesResult.data || []}
      neighborhoods={neighborhoodsResult.data || []}
      settings={settingsResult.data}
    />
  );
}
