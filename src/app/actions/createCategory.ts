'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers, cookies } from 'next/headers'

export async function createCategory(name: string, icon?: string) {
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
        // Fallback to headers
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
      return { success: false, error: 'No tienes permisos para crear categorías.' }
    }

    const trimmed = name.trim()
    if (!trimmed) {
      return { success: false, error: 'El nombre de la categoría es requerido' }
    }

    // Default icon (clean modern hanger icon) if none provided
    const defaultIcon =
      icon ||
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M12 2a3 3 0 0 0-3 3c0 1.3.8 2.4 2 2.8V9l-8.5 7.5A2 2 0 0 0 4 20h16a2 2 0 0 0 1.5-3.5L13 9V7.8c1.2-.4 2-1.5 2-2.8a3 3 0 0 0-3-3z"/></svg>'

    const newCat = await payload.create({
      collection: 'categories',
      data: {
        name: trimmed,
        icon: defaultIcon,
      },
    })

    revalidatePath('/catalogo')
    revalidatePath('/')

    return { success: true, category: newCat }
  } catch (error: any) {
    console.error('Error creating category:', error)
    return { success: false, error: error.message || 'Error al crear la categoría' }
  }
}
