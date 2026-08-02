'use server'

import { cookies } from 'next/headers'

export async function loginUser(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) {
    return { success: false, error: 'Por favor ingresa correo y contraseña.' }
  }

  try {
    // Usamos el Local API rest de Payload para iniciar sesión
    const res = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (res.ok && data.token) {
      // Configuramos la cookie de sesión para Payload
      const cookieStore = await cookies()
      cookieStore.set('payload-token', data.token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 días
      })
      return { success: true }
    } else {
      return { success: false, error: data.errors?.[0]?.message || 'Credenciales inválidas' }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    return { success: false, error: 'Error interno del servidor al iniciar sesión.' }
  }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
  return { success: true }
}
