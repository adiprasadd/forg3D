import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/config";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;
    const partNumber = parseInt(formData.get("partNumber") as string);
    const totalChunks = parseInt(formData.get("totalChunks") as string);

    if (!file || !fileName) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const chunkName = `${Date.now()}-${fileName}.part${partNumber}`;

    // Upload chunk to Supabase
    const { data, error } = await supabase.storage
      .from("3d_files")
      .upload(chunkName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json({
      chunkId: data.path,
      partNumber,
    });
  } catch (error) {
    console.error("Error handling chunk upload:", error);
    return NextResponse.json(
      { error: "Failed to process chunk upload" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
