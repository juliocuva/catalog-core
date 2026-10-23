'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function updateProduct(productId: string, formData: FormData) {
  try {
    const payload = await getPayload({ config: await configPromise })

    // Security Check
    const { user } = await payload.auth({ headers: await headers() })
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
    if (categoryId === 'new' && newCategoryName) {
      const newCat = await payload.create({
        collection: 'categories',
        data: { name: newCategoryName }
      })
      categoryId = String(newCat.id)
    }

    // Build specifications array
    const specifications: { name: string; value: string }[] = []
    if (price) {
      specifications.push({ name: 'Precio', value: price })
    }
    if (sizes) {
      sizes.split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
        specifications.push({ name: 'Talla', value: s })
      })
    }
    if (colors) {
      colors.split(',').map(c => c.trim()).filter(Boolean).forEach(c => {
        specifications.push({ name: 'Color', value: c })
      })
    }

    let updatedData: any = {
      name,
      category: Number(categoryId),
      isNew,
      specifications,
    }

    if (description !== undefined) {
      updatedData.description = description
        ? {
            root: {
              type: "root",
              format: "",
              indent: 0,
              version: 1,
              children: [
                {
                  type: "paragraph",
                  format: "",
                  indent: 0,
                  version: 1,
                  children: [
                    {
                      mode: "normal",
                      text: description,
                      type: "text",
                      style: "",
                      detail: 0,
                      format: 0,
                      version: 1
                    }
                  ]
                }
              ]
            }
          }
        : null
    }

    // Si se subieron nuevas imágenes
    if (images.length > 0) {
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
      updatedData.images = mediaIds
    }

    // 2. Update Product
    const updatedProduct = await payload.update({
      collection: 'products',
      id: productId,
      data: updatedData,
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
