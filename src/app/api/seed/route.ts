import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

const MOCK_CATEGORIES = [
  { name: 'Calzado', icon: '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h5.426a1 1 0 0 1 .863 .496l1.064 1.823a3 3 0 0 0 1.896 1.407l4.677 1.114a4 4 0 0 1 3.074 3.89v2.27a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 13l1 -2"/></svg>' },
  { name: 'Relojes', icon: '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
  { name: 'Bolsos', icon: '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>' },
  { name: 'Belleza', icon: '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>' },
  { name: 'Ropa', icon: '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>' },
  { name: 'Accesorios', icon: '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>' },
]

const MOCK_PRODUCTS = [
  { name: 'Tenis Urbanos Blancos Mujer', brandName: 'New', categoryName: 'Calzado', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop', isNew: true },
  { name: 'Chaqueta de Cuero Vintage', brandName: 'Premium', categoryName: 'Ropa', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop', isNew: false },
  { name: 'Camisa Blanca Formal Fit', brandName: 'Elegance', categoryName: 'Ropa', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop', isNew: true },
  { name: 'Pantalón Cargo Casual', brandName: 'Urban', categoryName: 'Ropa', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop', isNew: false },
  { name: 'Gorra Deportiva Negra', brandName: 'Sport', categoryName: 'Accesorios', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop', isNew: false },
  { name: 'Tenis Deportivos Runner', brandName: 'Active', categoryName: 'Calzado', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop', isNew: true },
  { name: 'Bolso Tote de Cuero', brandName: 'LeatherCo', categoryName: 'Bolsos', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=600&auto=format&fit=crop', isNew: false },
  { name: 'Reloj Cronógrafo Acero', brandName: 'Time', categoryName: 'Relojes', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop', isNew: true }
]

export async function GET() {
  const payload = await getPayload({ config: await configPromise })
  const log = []

  try {
    // 0. Seed Admin User
    const existingUsers = await payload.find({ collection: 'users', limit: 1 })
    if (existingUsers.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'juliocuva@gmail.com',
          password: 'administrador2026',
          role: 'administrador'
        }
      })
      log.push('Created master admin user: juliocuva@gmail.com (Password: administrador2026)')
    } else {
      log.push('Users already exist, skipped admin creation.')
    }

    // 1. Seed Categories
    const categoryMap: Record<string, number> = {}
    for (const cat of MOCK_CATEGORIES) {
      const existing = await payload.find({ collection: 'categories', where: { name: { equals: cat.name } } })
      if (existing.totalDocs === 0) {
        const created = await payload.create({ collection: 'categories', data: { name: cat.name, icon: cat.icon } })
        categoryMap[cat.name] = created.id as number
        log.push(`Created category: ${cat.name}`)
      } else {
        categoryMap[cat.name] = existing.docs[0].id as number
        log.push(`Found category: ${cat.name}`)
      }
    }

    // 2. Seed Brands
    const brandMap: Record<string, number> = {}
    for (const p of MOCK_PRODUCTS) {
      if (!brandMap[p.brandName]) {
        const existing = await payload.find({ collection: 'brands', where: { name: { equals: p.brandName } } })
        if (existing.totalDocs === 0) {
          const created = await payload.create({ collection: 'brands', data: { name: p.brandName } })
          brandMap[p.brandName] = created.id as number
          log.push(`Created brand: ${p.brandName}`)
        } else {
          brandMap[p.brandName] = existing.docs[0].id as number
        }
      }
    }

    // 3. Seed Products
    for (const p of MOCK_PRODUCTS) {
      const existing = await payload.find({ collection: 'products', where: { name: { equals: p.name } } })
      if (existing.totalDocs === 0) {
        await payload.create({ 
          collection: 'products', 
          data: { 
            name: p.name,
            category: categoryMap[p.categoryName],
            brand: brandMap[p.brandName],
            isNew: p.isNew,
            status: 'active',
            mockImageUrl: p.image // Save the mock image here to preserve UI look
          } 
        })
        log.push(`Created product: ${p.name}`)
      } else {
        log.push(`Product exists: ${p.name}`)
      }
    }

    return NextResponse.json({ success: true, log })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
