import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/config";

export async function POST(request: Request) {
  try {
    const { fileName, totalChunks } = await request.json();

    // Combine chunks logic here
    const finalName = `${Date.now()}-${fileName}`;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("3d_files").getPublicUrl(finalName);

    return NextResponse.json({
      url: publicUrl,
      key: finalName,
    });
  } catch (error) {
    console.error("Error completing upload:", error);
    return NextResponse.json(
      { error: "Failed to complete upload" },
      { status: 500 }
    );
  }
}
