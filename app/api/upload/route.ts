import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const baseFileName = formData.get('baseFileName') as string;
    const metadata = JSON.parse(formData.get('metadata') as string);
    
    // Create base directory for the model in uploads folder
    const modelDir = path.join(process.cwd(), 'public', 'uploads', baseFileName);
    await mkdir(modelDir, { recursive: true });
    
    // Handle model files
    const modelFiles = formData.getAll('modelFiles');
for (const file of modelFiles) {
  if (file instanceof File) {
    // Check if webkitRelativePath exists, otherwise use filename
    const filePath = file.webkitRelativePath 
      ? path.join(modelDir, file.webkitRelativePath.split('/').slice(1).join('/'))
      : path.join(modelDir, file.name);

    // Create the directory structure for the file
    await mkdir(path.dirname(filePath), { recursive: true });
    
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
  }
}

    // Handle cover image
    const cover = formData.get('cover') as File;
    if (cover) {
      const coverPath = path.join(modelDir, 'cover' + path.extname(cover.name));
      const coverBuffer = Buffer.from(await cover.arrayBuffer());
      await writeFile(coverPath, coverBuffer);
    }

    // Save metadata
    const metadataPath = path.join(modelDir, 'metadata.json');
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    // Return success response with file paths
    return NextResponse.json({ 
      success: true,
      fileName: baseFileName,
      files: {
        modelDir: `/uploads/${baseFileName}`,
        cover: `/uploads/${baseFileName}/cover${cover ? path.extname(cover.name) : ''}`,
        metadata: `/uploads/${baseFileName}/metadata.json`
      },
      message: 'Upload successful' 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// import { NextRequest, NextResponse } from 'next/server';
// import { writeFile, mkdir } from 'fs/promises';
// import path from 'path';

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const baseFileName = formData.get('baseFileName') as string;
//     const metadata = JSON.parse(formData.get('metadata') as string);
    
//     // Create base directory for the model in uploads folder
//     const modelDir = path.join(process.cwd(), 'public', 'uploads', baseFileName);
//     await mkdir(modelDir, { recursive: true });
    
//     // Handle model files
//     const modelFiles = formData.getAll('modelFiles');
//     for (const file of modelFiles) {
//       if (file instanceof File) {
//         const filePath = path.join(modelDir, file.name);
        
//         // Ensure the directory exists (for texture folders)
//         await mkdir(path.dirname(filePath), { recursive: true });
        
//         const buffer = Buffer.from(await file.arrayBuffer());
//         await writeFile(filePath, buffer);
//       }
//     }

//     // Handle cover image
//     const cover = formData.get('cover') as File;
//     if (cover) {
//       const coverPath = path.join(modelDir, 'cover' + path.extname(cover.name));
//       const coverBuffer = Buffer.from(await cover.arrayBuffer());
//       await writeFile(coverPath, coverBuffer);
//     }

//     // Save metadata
//     const metadataPath = path.join(modelDir, 'metadata.json');
//     await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

//     return NextResponse.json({ 
//       fileName: baseFileName,
//       message: 'Upload successful' 
//     });

//   } catch (error) {
//     console.error('Upload error:', error);
//     return NextResponse.json(
//       { error: 'Upload failed' },
//       { status: 500 }
//     );
//   }
// }

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// import { NextResponse } from 'next/server';
// import { writeFile, mkdir } from 'fs/promises';
// import path from 'path';

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
    
//     const model = formData.get('model') as File;
//     const cover = formData.get('cover') as File;
//     const metadataStr = formData.get('metadata') as string;
//     const baseFileName = formData.get('baseFileName') as string;

//     // Create base upload directory
//     const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
//     // Create a specific directory for this upload using baseFileName
//     const modelDir = path.join(uploadDir, baseFileName);
//     await mkdir(modelDir, { recursive: true });

//     // Save model file
//     const modelExt = path.extname(model.name);
//     const modelFileName = `model${modelExt}`;
//     const modelPath = path.join(modelDir, modelFileName);
//     const modelBuffer = Buffer.from(await model.arrayBuffer());
//     await writeFile(modelPath, modelBuffer);

//     // Save cover image
//     const coverExt = path.extname(cover.name);
//     const coverFileName = `cover${coverExt}`;
//     const coverPath = path.join(modelDir, coverFileName);
//     const coverBuffer = Buffer.from(await cover.arrayBuffer());
//     await writeFile(coverPath, coverBuffer);

//     // Save metadata
//     const metadataPath = path.join(modelDir, 'metadata.json');
//     await writeFile(metadataPath, metadataStr);

//     return NextResponse.json({
//       success: true,
//       fileName: baseFileName,
//       files: {
//         model: `/uploads/${baseFileName}/${modelFileName}`,
//         cover: `/uploads/${baseFileName}/${coverFileName}`,
//         metadata: `/uploads/${baseFileName}/metadata.json`
//       }
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//   }
// }