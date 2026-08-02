'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function deleteProduct(productId: string) {
  try {
    const payload = await getPayload({ config: await configPromise })

    // Security Check
    const { user } = await payload.auth({ headers: await headers() })
    if (!user || !['administrador', 'comercial'].includes(user.role as string)) {
      return { success: false, error: 'No tienes permisos para eliminar productos.' }
    }

    await payload.delete({
      collection: 'products',
      id: productId,
    })

    revalidatePath('/catalogo')
    revalidatePath('/')

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return { success: false, error: error.message || 'Error al eliminar el producto' }
  }
}
