import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import CatalogClient from './CatalogClient'
import { getCategoryIconSvg } from '@/app/utils/categoryIcons'

export const dynamic = 'force-dynamic';

export default async function CatalogoPage() {
  let payload;
  let isAdmin = false;
  let userRole: string | null = null;
  let products: any[] = [];
  let categories: any[] = [];
  let dbError: string | null = null;

  try {
    payload = await getPayload({ config: await configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    isAdmin = !!user;
    userRole = user?.role || null;
    // Fetch active products
    const productsRes = await payload.find({
      collection: 'products',
      where: { status: { equals: 'active' } },
      limit: 100,
      depth: 2,
    })
    products = productsRes.docs;

    // Fetch categories
    const categoriesRes = await payload.find({
      collection: 'categories',
      limit: 100,
    })
    categories = categoriesRes.docs;

    // Actualizar automáticamente en BD cualquier categoría con ícono genérico al ícono específico correspondiente
    for (const cat of categories) {
      const properIcon = getCategoryIconSvg(cat.name, cat.icon);
      if (properIcon !== cat.icon && (!cat.icon || cat.icon.includes('M12 2a3 3 0 0 0-3 3'))) {
        try {
          await payload.update({
            collection: 'categories',
            id: cat.id,
            data: { icon: properIcon },
            overrideAccess: true,
          });
          cat.icon = properIcon;
        } catch (e) {
          // ignore
        }
      }
    }

    // Si la base de datos está totalmente vacía de categorías (primer arranque), inicializamos las 4 de Guapura directamente sin revalidar en render
    if (categories.length === 0) {
      const defaultCategories = [
        {
          name: 'Pantalones',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M6 3h12v4l-2 14h-3l-1-9-1 9H8L6 7V3z"/></svg>',
        },
        {
          name: 'Blusas',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>',
        },
        {
          name: 'Vestidos',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M8 3h8l1 6-3 2 4 10H6l4-10-3-2 1-6z"/><path d="M10 3a2 2 0 0 0 4 0"/></svg>',
        },
        {
          name: 'Calzado',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M3 17h18l-1.5-5-4.5-1-4 3H3v3z"/><path d="M3 17v2a1 1 0 0 0 1 1h4v-3"/><path d="M19 17v2a1 1 0 0 0 1 1h1v-3"/></svg>',
        },
      ];
      for (const cat of defaultCategories) {
        await payload.create({
          collection: 'categories',
          data: cat,
          overrideAccess: true,
        });
      }
      const updatedCategories = await payload.find({
        collection: 'categories',
        limit: 100,
      });
      categories = updatedCategories.docs;
    }
  } catch (err: any) {
    dbError = err.message || String(err);
    console.error("Catalogo DB Error:", err);
  }

  if (dbError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl max-w-lg w-full shadow-lg border border-red-200">
          <h2 className="font-bold text-lg mb-2">Error de conexión a la base de datos</h2>
          <p className="text-sm mb-4">El sistema no pudo cargar el catálogo. Detalles técnicos:</p>
          <code className="block bg-red-100 p-3 rounded text-xs font-mono break-words">{dbError}</code>
        </div>
      </div>
    )
  }

  return <CatalogClient initialProducts={products} initialCategories={categories} isAdmin={isAdmin} userRole={userRole} />
}
