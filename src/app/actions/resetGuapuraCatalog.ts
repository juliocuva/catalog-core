'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function resetGuapuraCatalog() {
  try {
    const payload = await getPayload({ config: await configPromise })

    // 1. Obtener o crear las 4 categorías
    const catRes = await payload.find({
      collection: 'categories',
      limit: 100,
    })

    const catMap: { [key: string]: string | number } = {}
    for (const c of catRes.docs) {
      catMap[c.name.toLowerCase().trim()] = c.id
    }

    // 2. Eliminar productos antiguos de muestra (relojes, gorras, tenis masculinos, etc.)
    const allProducts = await payload.find({
      collection: 'products',
      limit: 200,
    })

    const masculineKeywords = [
      'reloj', 'cronógrafo', 'gorra', 'runner', 'cat', 'médico', 'industrial',
      'overol', 'cat', 'botas', 'bota', 'hombre', 'dryfit', 'short', 'deportivo'
    ]

    for (const p of allProducts.docs) {
      const nameLower = p.name.toLowerCase()
      const isMasculine = masculineKeywords.some(kw => nameLower.includes(kw))
      // También si no tiene categoría válida de Guapura
      if (isMasculine || !p.category) {
        await payload.delete({
          collection: 'products',
          id: p.id,
        })
      }
    }

    // 3. Catálogo oficial Guapura Boutique
    const boutiqueItems = [
      // PANTALONES
      {
        name: 'Pantalón Sastre Tiro Alto Palazzo',
        category: catMap['pantalones'],
        price: '$135.000',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Negro', 'Beige', 'Blanco'],
        description: 'Pantalón palazzo de tiro alto con pretina anatómica y pinzas delanteras. Confeccionado en tela sastre con caída fluida, ideal para estilizar la silueta en jornadas ejecutivas y eventos.',
        mockImageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
        isNew: true,
      },
      {
        name: 'Pantalón Cigarette Ejecutivo Confort',
        category: catMap['pantalones'],
        price: '$125.000',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Negro', 'Azul', 'Beige'],
        description: 'Corte recto ajustado al tobillo con tejido elástico premium que no se arruga. Acompaña con tacones o mocasines para un look pulcro y moderno.',
        mockImageUrl: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=800&auto=format&fit=crop',
        isNew: false,
      },
      // BLUSAS
      {
        name: 'Blusa Satinada Escote V Lila Chic',
        category: catMap['blusas'],
        price: '$95.000',
        sizes: ['XS', 'S', 'M', 'L', 'Única'],
        colors: ['Lila / Púrpura', 'Blanco', 'Rosa / Fucsia'],
        description: 'Blusa en satín sedoso de tacto ultrasuave. Cuello en V sutil y mangas abullonadas con puño ajustado. La pieza perfecta para elevar cualquier pantalón o falda.',
        mockImageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=800&auto=format&fit=crop',
        isNew: true,
      },
      {
        name: 'Camisa Oxford Femenina Slim Fit',
        category: catMap['blusas'],
        price: '$110.000',
        sizes: ['S', 'M', 'L'],
        colors: ['Blanco', 'Azul', 'Rosa / Fucsia'],
        description: 'Camisa en popelina de algodón premium con botones ocultos y entalle femenino que realza la figura sin apretar. Indispensable en tu fondo de armario.',
        mockImageUrl: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800&auto=format&fit=crop',
        isNew: false,
      },
      {
        name: 'Blusa Drapeada con Detalle en Cuello',
        category: catMap['blusas'],
        price: '$89.000',
        sizes: ['S', 'M', 'L', 'Única'],
        colors: ['Beige', 'Negro', 'Blanco'],
        description: 'Diseño asimétrico con drapeado frontal que disimula y estiliza. Tejido liviano y fresco con acabado semi-mate.',
        mockImageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop',
        isNew: true,
      },
      // VESTIDOS
      {
        name: 'Vestido Midi Ejecutivo con Cinturón',
        category: catMap['vestidos'],
        price: '$165.000',
        sizes: ['S', 'M', 'L'],
        colors: ['Negro', 'Lila / Púrpura', 'Rojo'],
        description: 'Vestido midi con falda en A, manga francesa y cinturón al tono con hebilla dorada. Estructura sastre impecable para reuniones de alto impacto.',
        mockImageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
        isNew: true,
      },
      {
        name: 'Vestido Camisero Seda Estampado',
        category: catMap['vestidos'],
        price: '$150.000',
        sizes: ['S', 'M', 'L', 'Única'],
        colors: ['Estampado', 'Beige', 'Azul'],
        description: 'Vestido camisero fluido con botones delanteros y lazo ajustable a la cintura. Perfecto para pasar del día a la noche con solo cambiar de accesorios.',
        mockImageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
        isNew: false,
      },
      {
        name: 'Vestido Tubo Asimétrico Gala & Cóctel',
        category: catMap['vestidos'],
        price: '$180.000',
        sizes: ['XS', 'S', 'M'],
        colors: ['Rojo', 'Negro', 'Lila / Púrpura'],
        description: 'Vestido de corte entallado con hombro descubierto y forro interno completo. Elegancia pura para eventos corporativos y celebraciones.',
        mockImageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
        isNew: true,
      },
      // CALZADO
      {
        name: 'Stilettos Clásicos en Charol 7cm',
        category: catMap['calzado'],
        price: '$155.000',
        sizes: ['35', '36', '37', '38', '39'],
        colors: ['Negro', 'Rojo', 'Beige'],
        description: 'Zapatos de salón con punta fina y tacón medio de 7cm con plantilla acolchada de confort. Diseñados para brindar porte y comodidad durante todo el día.',
        mockImageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
        isNew: true,
      },
      {
        name: 'Zapatos Tacón Bloque Cuero Elegance',
        category: catMap['calzado'],
        price: '$145.000',
        sizes: ['36', '37', '38', '39'],
        colors: ['Beige', 'Negro', 'Dorado / Mostaza'],
        description: 'Calzado en cuero suave con tacón geométrico cuadrado de 5cm. Máxima estabilidad y sofisticación para caminar con seguridad.',
        mockImageUrl: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
        isNew: false,
      },
    ]

    for (const item of boutiqueItems) {
      if (!item.category) continue

      const specifications: { name: string; value: string }[] = [
        { name: 'Precio', value: item.price },
        ...item.sizes.map(s => ({ name: 'Talla', value: s })),
        ...item.colors.map(c => ({ name: 'Color', value: c })),
      ]

      const lexicalDescription = {
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
                  text: item.description,
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

      await payload.create({
        collection: 'products',
        data: {
          name: item.name,
          category: Number(item.category),
          status: 'active',
          isNew: item.isNew,
          mockImageUrl: item.mockImageUrl,
          specifications,
          description: lexicalDescription as any,
        },
      })
    }

    revalidatePath('/catalogo')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error resetting catalog:', error)
    return { success: false, error: error.message }
  }
}
