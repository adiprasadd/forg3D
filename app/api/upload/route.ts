import { NextResponse } from "next/server";
import { Web3Storage } from "web3.storage";

// Initialize Web3.Storage client
const client = new Web3Storage({
  token: process.env.WEB3_STORAGE_TOKEN || "",
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Web3.Storage (IPFS)
    const cid = await client.put([file]);
    const modelUrl = `https://${cid}.ipfs.dweb.link/${file.name}`;

    return NextResponse.json({ modelUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
