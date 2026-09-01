import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string

    if (!file || !name) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const payload = await getPayload({ config: await configPromise })

    // 1. Convert File to Buffer for Payload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 2. Upload to Media collection
    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: name,
      },
      file: {
        data: buffer,
        name: file.name,
        mimetype: file.type,
        size: file.size,
      },
    })

    // 3. Create Product linking the Media
    const productDoc = await payload.create({
      collection: 'products',
      data: {
        name,
        description,
        status: 'active',
        category: category ? Number(category) : null,
        images: [
          {
            image: mediaDoc.id,
          }
        ],
      },
    })

    return NextResponse.json({ success: true, product: productDoc }, { status: 201 })
  } catch (error: any) {
    console.error('Quick product error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
