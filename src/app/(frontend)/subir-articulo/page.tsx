import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import UploadArticleClient from './UploadArticleClient'

export const dynamic = 'force-dynamic';

export default async function SubirArticuloPage() {
  const payload = await getPayload({ config: await configPromise })
  const { user } = await payload.auth({ headers: await headers() })

  // Validar permisos
  if (!user || !['administrador', 'comercial'].includes(user.role as string)) {
    redirect('/login?error=' + encodeURIComponent('Por favor inicia sesión con tu cuenta comercial para subir artículos.'))
  }

  // Traer categorías activas
  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  return <UploadArticleClient initialCategories={categoriesRes.docs} />
}
