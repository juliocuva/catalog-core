'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers, cookies } from 'next/headers'
import { getCategoryIconSvg } from '@/app/utils/categoryIcons'

export async function uploadProduct(formData: FormData) {
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
      return { success: false, error: 'No tienes permisos para crear productos.' }
    }

    const name = (formData.get('name') as string)?.trim()
    let categoryId = (formData.get('categoryId') as string)?.trim()
    const newCategoryName = (formData.get('newCategoryName') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()
    const price = (formData.get('price') as string)?.trim()
    const sizes = (formData.get('sizes') as string)?.trim()
    const colors = (formData.get('colors') as string)?.trim()
    const isNew = formData.get('isNew') === 'true'

    // Support up to 3 images (as files or pre-compressed base64 data URLs)
    const images: File[] = []
    const img1 = formData.get('image1') as File
    const img2 = formData.get('image2') as File
    const img3 = formData.get('image3') as File
    if (img1 && img1.size > 0) images.push(img1)
    if (img2 && img2.size > 0) images.push(img2)
    if (img3 && img3.size > 0) images.push(img3)

    const hasBase64 = Boolean(
      formData.get('base64_image1') ||
      formData.get('base64_image2') ||
      formData.get('base64_image3')
    )

    if (!name || !categoryId || (images.length === 0 && !hasBase64)) {
      return { success: false, error: 'Faltan campos requeridos o la imagen del artículo' }
    }

    // Handle new category
    if (categoryId === 'new') {
      if (!newCategoryName) {
        return { success: false, error: 'Por favor ingresa el nombre de la nueva categoría.' }
      }

      // Check if category already exists
      const existing = await payload.find({
        collection: 'categories',
        where: {
          name: {
            equals: newCategoryName,
          },
        },
        limit: 1,
        overrideAccess: true,
      })

      if (existing.docs.length > 0) {
        categoryId = String(existing.docs[0].id)
      } else {
        const defaultIcon = getCategoryIconSvg(newCategoryName)

        const newCat = await payload.create({
          collection: 'categories',
          data: {
            name: newCategoryName,
            icon: defaultIcon,
          },
          overrideAccess: true,
        })
        categoryId = String(newCat.id)
      }
    }

    const numCategoryId = Number(categoryId)
    if (!categoryId || isNaN(numCategoryId)) {
      return { success: false, error: 'La categoría seleccionada no es válida.' }
    }

    // 1. Convert photos to lightweight Base64 Data URLs so they persist directly
    // in PostgreSQL with ZERO local file system dependencies and ZERO consumption on Vercel
    const base64List: string[] = []

    for (const slot of ['base64_image1', 'base64_image2', 'base64_image3']) {
      const val = formData.get(slot) as string | null
      if (val && val.startsWith('data:image')) {
        base64List.push(val)
      }
    }

    if (base64List.length === 0) {
      for (const img of images) {
        if (img && img.size > 0) {
          const arrayBuffer = await img.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const mime = img.type || 'image/jpeg'
          base64List.push(`data:${mime};base64,${buffer.toString('base64')}`)
        }
      }
    }

    const mockImageUrl = base64List.length > 0 ? JSON.stringify(base64List) : ''

    // Build specifications array (Precio, Talla, Color)
    const specifications: { name: string; value: string }[] = []
    if (price) {
      specifications.push({ name: 'Precio', value: price })
    }
    if (sizes) {
      sizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((s) => {
          specifications.push({ name: 'Talla', value: s })
        })
    }
    if (colors) {
      colors
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
        .forEach((c) => {
          specifications.push({ name: 'Color', value: c })
        })
    }

    // Prepare description for Lexical RichText field
    let lexicalDescription = null
    if (description) {
      lexicalDescription = {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  mode: 'normal',
                  text: description,
                  type: 'text',
                  style: '',
                  detail: 0,
                  format: 0,
                  version: 1,
                },
              ],
            },
          ],
        },
      }
    }

    // 2. Create Product
    const newProduct = await payload.create({
      collection: 'products',
      data: {
        name,
        description: lexicalDescription as any,
        category: numCategoryId,
        specifications,
        isNew,
        mockImageUrl,
      },
      overrideAccess: true,
    })

    revalidatePath('/catalogo')
    revalidatePath('/')

    return { success: true, product: newProduct }
  } catch (error: any) {
    console.error('Error uploading product:', error)
    return { success: false, error: error.message || 'Error al subir el producto' }
  }
}
