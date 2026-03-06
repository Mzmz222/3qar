import { createClient } from "@/lib/supabase/server";
import CinematicHome from "@/components/CinematicHome";

export const revalidate = 60; // ISR Support

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();

  // Parse search params (Next 15 treats searchParams as a Promise)
  const resolvedParams = await searchParams;
  const districtFilter = typeof resolvedParams.district === "string" ? resolvedParams.district : null;
  const priceMaxFilter = typeof resolvedParams.price_max === "string" ? parseInt(resolvedParams.price_max) : null;

  // Build the query
  let query = supabase
    .from("properties")
    .select("*, districts(name), property_images(image_url, is_cover)")
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (districtFilter) {
    query = query.eq("district", districtFilter);
  }

  // Not doing strict price filtering because price is currently a text column (example: "1,500,000 ريال") 
  // For production, price should be numeric, but according to schema it's text.
  // We will just do a basic fetch based on district.

  const { data: properties } = await query;
  const { data: districts } = await supabase.from("districts").select("*").order("name");

  return (
    <>
      <CinematicHome properties={properties || []} districts={districts || []} />
    </>
  );
}
