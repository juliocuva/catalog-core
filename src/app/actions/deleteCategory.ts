'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers, cookies } from 'next/headers'

export async function deleteCategory(categoryId: string | number) {
  try {
    const payload = await getPayload({ config: await configPromise })

    // Robust Security Check using cookie and headers
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    let user = null

    if (token) {
      try {
        const authRes = await payload.auth({
          headers: new Headers({
            Authorization: `JWT ${token}`,
          }),
        })
        user = authRes.user
      } catch (e) {
        // Fallback to headers below
      }
    }

    if (!user) {
      try {
        const authRes = await payload.auth({ headers: await headers() })
        user = authRes.user
      } catch (e) {
        // user remains null
      }
    }

    if (!user || !['administrador', 'comercial'].includes(user.role as string)) {
      return { success: false, error: 'No tienes permisos para eliminar categorías.' }
    }

    // 1. Check for any products referencing this category and cascade delete them
    // to prevent PostgreSQL foreign key constraint violation (products_category_id_categories_id_fk)
    try {
      const linkedProducts = await payload.find({
        collection: 'products',
        where: {
          category: {
            equals: categoryId,
          },
        },
        limit: 500,
        depth: 0,
      })

      if (linkedProducts.docs && linkedProducts.docs.length > 0) {
        for (const prod of linkedProducts.docs) {
          await payload.delete({
            collection: 'products',
            id: prod.id,
          })
        }
      }
    } catch (prodErr) {
      console.warn('Notice while cleaning up linked products for category:', prodErr)
    }

    // 2. Delete the category itself
    await payload.delete({
      collection: 'categories',
      id: categoryId,
    })

    revalidatePath('/catalogo')
    revalidatePath('/')

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting category:', error)
    return { success: false, error: error.message || 'Error al eliminar la categoría' }
  }
}
