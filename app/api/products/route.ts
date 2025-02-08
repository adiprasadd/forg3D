import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    const directories = await fs.readdir(uploadsDir);
    
    const products = await Promise.all(
      directories.map(async (dir) => {
        // Skip .gitkeep file
        if (dir === '.gitkeep') return null;
        
        try {
          const metadataPath = path.join(uploadsDir, dir, 'metadata.json');
          const metadataContent = await fs.readFile(metadataPath, 'utf-8');
          const metadata = JSON.parse(metadataContent);
          
          return {
            name: metadata.name,
            price: metadata.price,
            coverImage: `/uploads/${dir}/cover.png`,
            moneyClaimed: 0, // Hardcoded for now
          };
        } catch (err) {
          console.error(`Error reading metadata for ${dir}:`, err);
          return null;
        }
      })
    );

    // Filter out null values and return valid products
    const validProducts = products.filter(product => product !== null);
    
    return NextResponse.json(validProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}