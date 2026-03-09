import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
    try {
        const { path } = await request.json();
        if (path) {
            revalidatePath(path);
        } else {
            // Revalidate common paths
            revalidatePath("/");
        }
        return NextResponse.json({ success: true, revalidated: path || "/" });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
