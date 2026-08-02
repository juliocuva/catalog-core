import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import CatalogClient from './CatalogClient'

export const dynamic = 'force-dynamic';

export default async function CatalogoPage() {
  const payload = await getPayload({ config: await configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  const isAdmin = !!user;
  const userRole = user?.role || null;
  
  // Fetch active products
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { status: { equals: 'active' } },
    limit: 100,
    depth: 2,
  })

  // Fetch categories
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  return <CatalogClient initialProducts={products} initialCategories={categories} isAdmin={isAdmin} userRole={userRole} />
}
