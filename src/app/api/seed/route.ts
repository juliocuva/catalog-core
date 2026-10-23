import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getPayload({ config: await configPromise });

    // 1. Create a Category
    const categoryDoc = await payload.create({
      collection: 'categories',
      data: { name: 'Ropa Deportiva' }
    });

    // 2. Create Product 1
    await payload.create({
      collection: 'products',
      data: {
        name: 'Camiseta DryFit Pro',
        category: categoryDoc.id,
        status: 'active',
        isNew: true,
        mockImageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop',
        specifications: [
          { name: 'Color', value: 'Azul Marino' },
          { name: 'Color', value: 'Gris Plata' },
          { name: 'Talla', value: 'M' },
          { name: 'Talla', value: 'L' }
        ]
      }
    });

    // 3. Create Product 2
    await payload.create({
      collection: 'products',
      data: {
        name: 'Shorts de Entrenamiento',
        category: categoryDoc.id,
        status: 'active',
        isNew: false,
        mockImageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1974&auto=format&fit=crop',
        specifications: [
          { name: 'Color', value: 'Negro' },
          { name: 'Talla', value: 'S' },
          { name: 'Talla', value: 'M' }
        ]
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

