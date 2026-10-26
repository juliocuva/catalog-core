import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { loginUser } from '@/app/actions/loginUser'

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const payload = await getPayload({ config: await configPromise })
  const { user } = await payload.auth({ headers: await headers() })

  // Si ya tiene sesión activa, redirigir directo al catálogo
  if (user) {
    redirect('/catalogo')
  }

  const { error } = await searchParams;

  async function handleLogin(formData: FormData) {
    'use server'
    const res = await loginUser(formData)
    if (res.success) {
      redirect('/catalogo')
    } else {
      redirect(`/login?error=${encodeURIComponent(res.error || 'Credenciales inválidas')}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F9] via-white to-brand-light-blue/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-pink-100 p-8 md:p-10 text-center">
        <Link href="/catalogo" className="inline-block mb-6 hover:opacity-85 transition-opacity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/guapura%20logo_Mesa%20de%20trabajo%201.png"
            alt="Guapura Boutique"
            className="h-14 mx-auto object-contain"
          />
        </Link>

        <div className="text-[11px] font-bold text-brand-primary tracking-[0.25em] uppercase mb-1">
          Acceso Comercial
        </div>
        <h1 className="text-xl font-black text-gray-900 mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-xs text-gray-500 mb-6">
          Ingresa para gestionar el inventario y publicar nuevas prendas en el catálogo.
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <form action={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-accent transition-all shadow-md active:scale-[0.99] cursor-pointer"
          >
            Entrar al Catálogo
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-xs">
          <Link href="/catalogo" className="text-gray-500 hover:text-brand-primary font-semibold flex items-center gap-1">
            ← Volver al Catálogo
          </Link>
          <a href="/admin" className="text-gray-400 hover:text-gray-600">
            Panel Admin Payload
          </a>
        </div>
      </div>
    </div>
  )
}
