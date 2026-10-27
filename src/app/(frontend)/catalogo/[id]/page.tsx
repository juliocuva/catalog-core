import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPlaceholderImage } from '../../../utils/getPlaceholder'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ProductGallery, CopyProductLinkButton } from './ProductDetailInteractive'

import { headers } from 'next/headers'

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config: await configPromise })
  const resolvedParams = await params;
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = headersList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  
  try {
    const product = await payload.findByID({
      collection: 'products',
      id: resolvedParams.id,
      depth: 2,
    })

    if (!product || product.status !== 'active') {
      return notFound()
    }

    let galleryUrls: string[] = [];

    // Prioritize mockImageUrl (stores base64 data URLs or cloud URLs)
    if ((product as any).mockImageUrl) {
      try {
        const parsed = JSON.parse((product as any).mockImageUrl);
        if (Array.isArray(parsed)) {
          galleryUrls = parsed.filter((url: any) => typeof url === 'string' && (url.startsWith('http') || url.startsWith('data:image')));
        } else if (typeof parsed === 'string' && (parsed.startsWith('http') || parsed.startsWith('data:image'))) {
          galleryUrls = [parsed];
        }
      } catch {
        if (typeof (product as any).mockImageUrl === 'string' && ((product as any).mockImageUrl.startsWith('http') || (product as any).mockImageUrl.startsWith('data:image'))) {
          galleryUrls = [(product as any).mockImageUrl];
        }
      }
    }

    // Only if mockImageUrl did not provide any images, check product.images (filtering out broken local relative paths)
    if (galleryUrls.length === 0 && product.images && Array.isArray(product.images)) {
      const mediaUrls = product.images
        .map((item: any) => item?.image?.url)
        .filter((url: string | undefined): url is string => Boolean(url && (url.startsWith('http') || url.startsWith('data:image'))));
      galleryUrls = mediaUrls;
    }

    if (galleryUrls.length === 0) {
      galleryUrls.push(getPlaceholderImage(product.name));
    }

    const categoryName = (product.category as any)?.name || 'Colección';
    const brandName = (product.brand as any)?.name || 'Guapura Boutique';

    // Combine explicit colors/sizes/price fields with specifications format
    const explicitColors = (product as any).colors || [];
    const explicitSizes = (product as any).sizes || [];
    
    const priceSpec = product.specifications?.find((s: any) => ['precio', 'price', 'valor'].includes((s.name || '').toLowerCase()));
    const priceValue = priceSpec?.value || null;

    const specColors = product.specifications?.filter((s: any) => s.name?.toLowerCase() === 'color' || s.name?.toLowerCase() === 'colores') || [];
    const specSizes = product.specifications?.filter((s: any) => ['talla', 'tallas', 'tamaño'].includes(s.name?.toLowerCase())) || [];
    const otherSpecs = product.specifications?.filter((s: any) => !['color', 'colores', 'talla', 'tallas', 'tamaño', 'precio', 'price', 'valor'].includes(s.name?.toLowerCase())) || [];

    const colors = [...explicitColors, ...specColors];
    const sizes = [...explicitSizes, ...specSizes];

    // WhatsApp logic
    const currentUrl = `${protocol}://${host}/catalogo/${product.id}` 
    const whatsappMessage = encodeURIComponent(
      `Hola Guapura Boutique, estoy interesada en la prenda: *${product.name}*${priceValue ? ` (${priceValue})` : ''}. ¿Me puedes dar más información? ${currentUrl}`
    );
    const whatsappLink = `https://wa.me/573113421026?text=${whatsappMessage}`;

    return (
      <div className="bg-white min-h-screen pb-28 md:pb-0 font-sans flex flex-col md:flex-row max-w-7xl mx-auto">
        
        {/* Mobile Header (Back button) */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 md:hidden">
          <Link href="/catalogo" className="p-2 bg-white/80 backdrop-blur rounded-full text-gray-900 shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <span className="font-semibold text-gray-900">Detalle de la Prenda</span>
          <div className="w-10" />
        </div>

        {/* Image Section (Gallery up to 3 photos) */}
        <ProductGallery images={galleryUrls} productName={product.name} />

        {/* Info Section */}
        <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16 flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-brand-accent uppercase tracking-widest">{brandName} <span className="text-gray-300 mx-2">•</span> <span className="text-gray-500">{categoryName}</span></p>
            <CopyProductLinkButton url={currentUrl} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">
            {product.name}
          </h1>

          {priceValue && (
            <p className="text-2xl md:text-3xl font-black text-brand-primary mb-6">
              {priceValue}
            </p>
          )}

          <div className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">
            {product.description ? (
              <div className="prose prose-sm max-w-none text-gray-700">
                {typeof product.description === 'string' 
                  ? <p>{product.description}</p> 
                  : <RichText data={product.description} />}
              </div>
            ) : (
              <p>Este producto no tiene una descripción detallada en este momento. Por favor contacta a un asesor para más información técnica o de materiales.</p>
            )}
          </div>

          {/* Options (Colors & Sizes style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            {/* Si hubieran colores en specs */}
            {colors.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Colores</h4>
                <div className="flex gap-2">
                  {colors.map((c: any, i: number) => (
                     <div key={i} className="flex flex-col items-center gap-1">
                       {/* Un círculo representativo, asumiendo que el value es un texto. Lo mostramos como etiqueta */}
                       <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700 border border-gray-200">{c.value}</span>
                     </div>
                  ))}
                </div>
              </div>
            )}

            {/* Si hubieran tallas en specs */}
            {sizes.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Tallas</h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s: any, i: number) => (
                    <div key={i} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 bg-white">
                      {s.value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Otras specs */}
          {otherSpecs.length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Especificaciones</h4>
              <ul className="space-y-2">
                {otherSpecs.map((spec: any, idx: number) => (
                  <li key={idx} className="flex justify-between border-b border-gray-100 py-2 text-sm">
                    <span className="text-gray-500">{spec.name}</span>
                    <span className="font-semibold text-gray-900 text-right">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button (Sticky on mobile, inline on desktop) */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 md:relative md:p-0 md:bg-transparent md:border-t-0 md:mt-auto z-20">
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-brand-primary text-white font-bold py-4 px-6 rounded-2xl flex justify-center items-center gap-2.5 hover:bg-brand-accent transition shadow-lg text-sm md:text-base active:scale-[0.99] touch-manipulation cursor-pointer"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 00-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span>Preguntar por esta Prenda</span>
            </a>
          </div>

        </div>
      </div>
    )
  } catch (error) {
    return notFound()
  }
}
