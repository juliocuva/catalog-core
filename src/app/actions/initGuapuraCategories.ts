'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function setupInitialCategories() {
  try {
    const payload = await getPayload({ config: await configPromise })

    const targetCategories = [
      {
        name: 'Pantalones',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M6 3h12v4l-2 14h-3l-1-9-1 9H8L6 7V3z"/></svg>',
      },
      {
        name: 'Blusas',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>',
      },
      {
        name: 'Vestidos',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M8 3h8l1 6-3 2 4 10H6l4-10-3-2 1-6z"/><path d="M10 3a2 2 0 0 0 4 0"/></svg>',
      },
      {
        name: 'Calzado',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M3 17h18l-1.5-5-4.5-1-4 3H3v3z"/><path d="M3 17v2a1 1 0 0 0 1 1h4v-3"/><path d="M19 17v2a1 1 0 0 0 1 1h1v-3"/></svg>',
      },
    ]

    const existing = await payload.find({
      collection: 'categories',
      limit: 100,
    })

    const existingNames = new Set(existing.docs.map(c => c.name.toLowerCase().trim()))

    for (const cat of targetCategories) {
      if (!existingNames.has(cat.name.toLowerCase().trim())) {
        await payload.create({
          collection: 'categories',
          data: {
            name: cat.name,
            icon: cat.icon,
          },
        })
      }
    }

    revalidatePath('/catalogo')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error setting up categories:', error)
    return { success: false, error: error.message }
  }
}
