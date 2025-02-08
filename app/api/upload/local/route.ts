import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create unique filename
    const uniqueFilename = `${Date.now()}-${file.name}`;

    // Define upload path (in public directory)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, uniqueFilename);

    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true });

    // Write file
    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      url: publicUrl,
      fileName: uniqueFilename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
