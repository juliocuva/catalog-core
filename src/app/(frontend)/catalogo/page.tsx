import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import CatalogClient from './CatalogClient'

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

    // Si la base de datos está totalmente vacía de categorías (primer arranque), inicializamos las 4 de Guapura
    if (categories.length === 0) {
      const { setupInitialCategories } = await import('@/app/actions/initGuapuraCategories');
      await setupInitialCategories();
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
