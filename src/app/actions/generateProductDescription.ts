'use server'

interface GenerateDescriptionParams {
  name: string
  categoryName?: string
  colors?: string[]
  sizes?: string[]
  imageBase64?: string | null
}

export async function generateProductDescription({
  name,
  categoryName = '',
  colors = [],
  sizes = [],
  imageBase64 = null,
}: GenerateDescriptionParams): Promise<{ success: boolean; description?: string; error?: string }> {
  try {
    const trimmedName = (name || '').trim()
    if (!trimmedName) {
      return { success: false, error: 'Por favor ingresa primero el nombre del artículo para que la IA sepa qué redactar.' }
    }

    const apiKey = process.env.GEMINI_API_KEY

    // 1. SI TIENE GEMINI API KEY CONFIGURADA: Usar Google Gemini 1.5 Flash
    if (apiKey) {
      try {
        const promptText = `Eres la asesora de moda y redactora estrella de "Guapura Boutique", una tienda de moda femenina y accesorios elegante, moderna y juvenil.
Escribe una descripción comercial atractiva, vendedora y sofisticada para el siguiente artículo:
- Nombre: ${trimmedName}
- Categoría: ${categoryName || 'Moda'}
${colors.length > 0 ? `- Colores: ${colors.join(', ')}` : ''}
${sizes.length > 0 ? `- Tallas: ${sizes.join(', ')}` : ''}

REGLAS DE REDACCIÓN:
1. Máximo 2 a 3 oraciones (concisa, persuasiva y llamativa para clientes en Instagram/WhatsApp).
2. Resalta comodidad, horma, caída, textura o versatilidad (ideal para ocasiones especiales o uso diario).
3. Tono cercano, chic y exclusivo de boutique.
4. NO uses hashtags ni listas con viñetas, solo texto fluido y elegante.`

        const contents: any[] = []
        const parts: any[] = [{ text: promptText }]

        // Si se envió la foto en base64, la adjuntamos para análisis visual
        if (imageBase64 && imageBase64.startsWith('data:image/')) {
          const mimeTypeMatch = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/)
          const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg'
          const base64Data = imageBase64.replace(/^data:[^;]+;base64,/, '')
          parts.unshift({
            inline_data: {
              mime_type: mimeType,
              data: base64Data,
            },
          })
        }

        contents.push({ role: 'user', parts })

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 200,
              },
            }),
          }
        )

        if (response.ok) {
          const data = await response.json()
          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
          if (aiText) {
            return { success: true, description: aiText }
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to smart boutique engine:', geminiErr)
      }
    }

    // 2. MOTOR INTELIGENTE DE MODA (Fallback elegante de Guapura Boutique)
    const cat = (categoryName || '').toLowerCase()
    const nameLower = trimmedName.toLowerCase()

    let templates: string[] = []

    if (cat.includes('reloj') || nameLower.includes('reloj') || nameLower.includes('watch')) {
      templates = [
        `Diseño elegante y sofisticado que eleva cualquier outfit. Con acabados de alta precisión y un estilo atemporal perfecto tanto para el día a día como para ocasiones especiales.`,
        `El accesorio imprescindible para marcar tu estilo. Combina elegancia, resistencia y un toque moderno que complementa a la perfección tu look Guapura.`,
        `Sofisticación en cada detalle. Un reloj versátil y distinguido con un diseño delicado que no pasa desapercibido.`,
      ]
    } else if (cat.includes('bolso') || cat.includes('cartera') || nameLower.includes('bolso') || nameLower.includes('cartera')) {
      templates = [
        `El complemento perfecto para tus mejores looks. Confeccionado con finos acabados, amplio espacio interior y una silueta moderna que combina funcionalidad y pura elegancia.`,
        `Diseñado para destacar con sofisticación. Un bolso versátil y ligero con detalles exclusivos, ideal para acompañarte en tu rutina con el sello Guapura.`,
        `Estilo, distinción y practicidad en una sola pieza. El toque chic definitivo para llevar todo lo que necesitas con total glamour.`,
      ]
    } else if (cat.includes('vestido') || nameLower.includes('vestido')) {
      templates = [
        `Silueta femenina con una caída impecable que realza tu figura con total comodidad. Confeccionado en tela suave al tacto, ideal para lucir radiante en cualquier evento o salida especial.`,
        `Elegancia sin esfuerzo. Una prenda diseñada para hacerte sentir segura y distinguida, con acabados delicados y una horma espectacular.`,
        `Frescura y sofisticación en su máxima expresión. Su corte moderno y textura ligera lo convierten en una opción versátil y llena de estilo.`,
      ]
    } else if (cat.includes('pantalon') || cat.includes('jean') || nameLower.includes('pantalon') || nameLower.includes('jean')) {
      templates = [
        `Horma perfecta que se adapta y estiliza tu silueta. Confeccionado en tela de alta calidad con la elasticidad ideal para brindarte máxima comodidad y estilo durante todo el día.`,
        `El básico premium que tu armario necesita. Corte favorecedor, tiro impecable y un diseño versátil que combina perfecto con blusas o tacones.`,
        `Comodidad absoluta sin perder el toque chic. Un pantalón moderno y versátil pensado para destacar con elegancia en cualquier ocasión.`,
      ]
    } else if (cat.includes('blusa') || cat.includes('top') || nameLower.includes('blusa') || nameLower.includes('top')) {
      templates = [
        `Diseño fresco, femenino y en tendencia. Su tela liviana y suave al tacto proporciona una caída delicada que puedes combinar fácilmente de día o de noche.`,
        `Elegante y sumamente versátil. Una blusa diseñada para brindar confort y estilo, con detalles que elevan tu outfit al instante.`,
        `El equilibrio perfecto entre sofisticación y frescura. Ideal para crear looks casuales o formales con el sello inconfundible de Guapura Boutique.`,
      ]
    } else if (cat.includes('calzado') || cat.includes('zapato') || nameLower.includes('sandalia') || nameLower.includes('tacon') || nameLower.includes('tenis')) {
      templates = [
        `Comodidad garantizada y estilo en cada paso. Confeccionados con materiales de primera calidad y un diseño ergonómico que estiliza tus pasos con total elegancia.`,
        `El toque final para un look impecable. Suaves, resistentes y con una estética moderna que se adapta a cualquier ocasión.`,
        `Diseñados para destacar sin sacrificar tu confort. Combínalos con tus outfits favoritos y camina siempre segura y a la moda.`,
      ]
    } else if (cat.includes('accesorio') || cat.includes('joya') || nameLower.includes('arete') || nameLower.includes('collar') || nameLower.includes('pulsera')) {
      templates = [
        `Detalles que marcan la diferencia. Una pieza delicada con brillo sutil y acabados de lujo, perfecta para darle ese toque de glamour extra a tu estilo.`,
        `Elegancia minimalista y sofisticada. Diseñado para realzar tu belleza natural y aportar distinción a cualquier combinación.`,
        `El toque de luz y exclusividad que complementa tus mejores atuendos. Liviano, duradero y lleno de encanto.`,
      ]
    } else {
      templates = [
        `Prenda exclusiva confeccionada con materiales seleccionados de alta calidad. Su horma favorecedora y diseño moderno la convierten en una pieza imprescindible para tu armario.`,
        `Diseño sofisticado, femenino y confortable. Pensado para brindarte la máxima versatilidad y hacerte lucir impecable en todo momento.`,
        `El balance perfecto entre moda, frescura y elegancia. Una prenda única con el sello y la distinción de Guapura Boutique.`,
      ]
    }

    // Elegir aleatoriamente entre las opciones disponibles para variedad
    const chosen = templates[Math.floor(Math.random() * templates.length)]

    return { success: true, description: chosen }
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al generar la descripción.' }
  }
}
