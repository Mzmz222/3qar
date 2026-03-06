"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import crypto from "crypto";

export async function addPropertyAction(formData: FormData) {
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim() || null;
    const deal_type = formData.get("deal_type")?.toString();
    const district_id = formData.get("district_id")?.toString() || null;
    const parcel_number = formData.get("parcel_number")?.toString().trim() || null;
    const area_size = formData.get("area_size")?.toString().trim() || null;
    const street_width = formData.get("street_width")?.toString().trim() || null;
    const dimensions = formData.get("dimensions")?.toString().trim() || null;
    const price = formData.get("price")?.toString().trim();
    const contact_numbers_raw = formData.get("contact_numbers")?.toString().trim();
    const lat_raw = formData.get("lat")?.toString().trim();
    const lng_raw = formData.get("lng")?.toString().trim();
    const location_url = formData.get("location_url")?.toString().trim();
    const property_type = formData.get("property_type")?.toString();

    // Basic Validation
    if (!title || !deal_type || !price || !property_type) {
        return { error: "الرجاء تعبئة الحقول المطلوبة" };
    }

    const extractCoords = (url: string) => {
        const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
        const qMatch = url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
        return null;
    };

    let lat = lat_raw ? parseFloat(lat_raw) : null;
    let lng = lng_raw ? parseFloat(lng_raw) : null;

    if ((!lat || !lng) && location_url) {
        const coords = extractCoords(location_url);
        if (coords) {
            lat = coords.lat;
            lng = coords.lng;
        }
    }

    const contact_numbers = contact_numbers_raw ? contact_numbers_raw.split(",").map(n => n.trim()).filter(Boolean) : null;

    // Process Images
    const files = formData.getAll("images") as File[];
    const validFiles = files.filter(f => f.size > 0 && f.name);

    if (validFiles.length > 11) {
        return { error: "عذراً، الحد الأقصى 11 صورة فقط." };
    }

    for (const f of validFiles) {
        if (f.size > 5 * 1024 * 1024) {
            return { error: `حجم الصورة ${f.name} يتجاوز 5MB.` };
        }
        if (!f.type.startsWith("image/")) {
            return { error: `الملف ${f.name} ليس صورة صالحة.` };
        }
    }

    const supabase = await createClient();

    // Generate QR Token
    const tokenBytes = crypto.randomBytes(16);
    const qr_token = tokenBytes.toString("hex");

    // Insert Property
    const { data: property, error: propertyError } = await supabase.from("properties").insert([{
        title,
        description,
        deal_type,
        property_type,
        district: district_id,
        parcel_number,
        area_size,
        street_width,
        dimensions,
        price,
        lat,
        lng,
        contact_numbers,
        qr_token,
        status: "published" // Default to published based on common usage, but can be draft
    }]).select().single();

    if (propertyError || !property) {
        console.error("Property Error:", propertyError);
        return { error: "حدث خطأ أثناء حفظ العقار." };
    }

    // Process & Upload Images
    for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const buffer = Buffer.from(await file.arrayBuffer());

        // Sharp WebP conversion
        const processedBuffer = await sharp(buffer)
            .resize({ width: 1920, height: 1080, fit: "inside", withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        const fileName = `${property.id}/${Date.now()}-${i}.webp`;

        const { error: uploadError } = await supabase.storage
            .from("images")
            .upload(fileName, processedBuffer, {
                contentType: "image/webp",
                cacheControl: "36000000",
            });

        if (!uploadError) {
            // Get public URL
            const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);

            await supabase.from("property_images").insert([{
                property_id: property.id,
                image_url: publicUrlData.publicUrl,
                is_cover: i === 0 // First image is cover
            }]);
        } else {
            console.error("Upload error:", uploadError);
        }
    }

    revalidatePath("/admin/properties");
    revalidatePath("/");
    redirect("/admin/properties");
}
