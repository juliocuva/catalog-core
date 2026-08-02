'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, error: 'Por favor ingresa correo y contraseña.' }
  }

  try {
    const payload = await getPayload({ config: await configPromise })
    
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (result && result.token) {
      // Configuramos la cookie de sesión para Payload
      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 días
      })
      return { success: true }
    } else {
      return { success: false, error: 'Credenciales inválidas' }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    return { success: false, error: 'Credenciales inválidas o error interno.' }
  }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
  return { success: true }
}
