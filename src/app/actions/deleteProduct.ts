'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers, cookies } from 'next/headers'

export async function deleteProduct(productId: string) {
  try {
    const payload = await getPayload({ config: await configPromise })

    // Robust Security Check
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
        // Fallback
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
