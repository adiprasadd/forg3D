import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, ALLOWED_FILE_TYPES } from "@/app/lib/s3/config";

export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json();

    // Validate file type
    const fileExtension = filename.toLowerCase().split(".").pop();
    if (!ALLOWED_FILE_TYPES.includes(`.${fileExtension}`)) {
      return NextResponse.json(
        { error: "File type not supported" },
        { status: 400 }
      );
    }

    // Generate unique file path
    const key = `models/${Date.now()}-${filename}`;

    // Create presigned URL for direct upload
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return NextResponse.json({
      uploadUrl,
      fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
      key,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
