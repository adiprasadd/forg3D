import { NextResponse } from "next/server";
import { s3Service } from "@/app/lib/s3/utils";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate presigned URL for upload
    const uploadUrl = await s3Service.generateUploadUrl(
      file.name,
      file.type
    );

    return NextResponse.json({
      uploadUrl,
      fileKey: `models/${Date.now()}-${file.name}`,
    });
  } catch (error) {
    console.error("Error handling file upload:", error);
    return NextResponse.json(
      { error: "Failed to process file upload" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
