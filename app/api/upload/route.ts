import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const model = formData.get('model') as File;
    const cover = formData.get('cover') as File;
    const metadataStr = formData.get('metadata') as string;
    const baseFileName = formData.get('baseFileName') as string;

    // Create base upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Create a specific directory for this upload using baseFileName
    const modelDir = path.join(uploadDir, baseFileName);
    await mkdir(modelDir, { recursive: true });

    // Save model file
    const modelExt = path.extname(model.name);
    const modelFileName = `model${modelExt}`;
    const modelPath = path.join(modelDir, modelFileName);
    const modelBuffer = Buffer.from(await model.arrayBuffer());
    await writeFile(modelPath, modelBuffer);

    // Save cover image
    const coverExt = path.extname(cover.name);
    const coverFileName = `cover${coverExt}`;
    const coverPath = path.join(modelDir, coverFileName);
    const coverBuffer = Buffer.from(await cover.arrayBuffer());
    await writeFile(coverPath, coverBuffer);

    // Save metadata
    const metadataPath = path.join(modelDir, 'metadata.json');
    await writeFile(metadataPath, metadataStr);

    return NextResponse.json({
      success: true,
      fileName: baseFileName,
      files: {
        model: `/uploads/${baseFileName}/${modelFileName}`,
        cover: `/uploads/${baseFileName}/${coverFileName}`,
        metadata: `/uploads/${baseFileName}/metadata.json`
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
  }
}