'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers, cookies } from 'next/headers'

import { getCategoryIconSvg } from '@/app/utils/categoryIcons'

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

    const resolvedIcon = getCategoryIconSvg(trimmed, icon)

    const newCat = await payload.create({
      collection: 'categories',
      data: {
        name: trimmed,
        icon: resolvedIcon,
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
