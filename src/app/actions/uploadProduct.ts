'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function uploadProduct(formData: FormData) {
  try {
    const payload = await getPayload({ config: await configPromise })

    // Security Check
    const { user } = await payload.auth({ headers: await headers() })
    if (!user || !['administrador', 'comercial'].includes(user.role as string)) {
      return { success: false, error: 'No tienes permisos para crear productos.' }
    }

    const name = formData.get('name') as string
    const categoryId = formData.get('categoryId') as string
    const isNew = formData.get('isNew') === 'true'
    
    // Support up to 3 images
    const images: File[] = []
    const img1 = formData.get('image1') as File
    const img2 = formData.get('image2') as File
    const img3 = formData.get('image3') as File
    if (img1 && img1.size > 0) images.push(img1)
    if (img2 && img2.size > 0) images.push(img2)
    if (img3 && img3.size > 0) images.push(img3)

    if (!name || !categoryId || images.length === 0) {
      return { success: false, error: 'Faltan campos requeridos o al menos una imagen' }
    }

    // 1. Upload Media
    const mediaIds = []
    for (const img of images) {
      const arrayBuffer = await img.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const uploadedMedia = await payload.create({
        collection: 'media',
        data: { alt: name },
        file: {
          data: buffer,
          mimetype: img.type,
          name: img.name,
          size: img.size,
        },
      })
      mediaIds.push({ image: uploadedMedia.id })
    }

    // 2. Create Product
    const newProduct = await payload.create({
      collection: 'products',
      data: {
        name,
        category: Number(categoryId),
        images: mediaIds,
        isNew,
      },
    })

    revalidatePath('/catalogo')
    revalidatePath('/')

    return { success: true, product: newProduct }
  } catch (error: any) {
    console.error('Error uploading product:', error)
    return { success: false, error: error.message || 'Error al subir el producto' }
  }
}
