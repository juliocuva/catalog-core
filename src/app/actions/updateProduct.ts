'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers, cookies } from 'next/headers'

export async function updateProduct(productId: string, formData: FormData) {
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

    if (!user || !['administrador', 'comercial', 'diseñador'].includes(user.role as string)) {
      return { success: false, error: 'No tienes permisos para editar productos.' }
    }

    const name = formData.get('name') as string
    let categoryId = formData.get('categoryId') as string
    const newCategoryName = formData.get('newCategoryName') as string
    const description = (formData.get('description') as string)?.trim()
    const price = (formData.get('price') as string)?.trim()
    const sizes = (formData.get('sizes') as string)?.trim()
    const colors = (formData.get('colors') as string)?.trim()
    const isNew = formData.get('isNew') === 'true'

    // Support up to 3 images
    const images: File[] = []
    const img1 = formData.get('image1') as File
    const img2 = formData.get('image2') as File
    const img3 = formData.get('image3') as File
    if (img1 && img1.size > 0) images.push(img1)
    if (img2 && img2.size > 0) images.push(img2)
    if (img3 && img3.size > 0) images.push(img3)

    if (!name || !categoryId) {
      return { success: false, error: 'Nombre y categoría son requeridos' }
    }

    // Handle new category
    if (categoryId === 'new') {
      if (!newCategoryName) {
        return { success: false, error: 'Por favor ingresa el nombre de la nueva categoría.' }
      }

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
        const defaultIcon =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M12 2a3 3 0 0 0-3 3c0 1.3.8 2.4 2 2.8V9l-8.5 7.5A2 2 0 0 0 4 20h16a2 2 0 0 0 1.5-3.5L13 9V7.8c1.2-.4 2-1.5 2-2.8a3 3 0 0 0-3-3z"/></svg>'

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

    // Build specifications array
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

    // Process new images if provided
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

    const updateData: any = {
      name,
      description: lexicalDescription as any,
      category: numCategoryId,
      specifications,
      isNew,
    }

    if (base64List.length > 0) {
      updateData.mockImageUrl = JSON.stringify(base64List)
    }

    const updatedProduct = await payload.update({
      collection: 'products',
      id: productId,
      data: updateData,
      overrideAccess: true,
    })

    revalidatePath('/catalogo')
    revalidatePath(`/catalogo/${productId}`)
    revalidatePath('/')

    return { success: true, product: updatedProduct }
  } catch (error: any) {
    console.error('Error updating product:', error)
    return { success: false, error: error.message || 'Error al actualizar el producto' }
  }
}
