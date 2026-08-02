'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function createUser(formData: FormData) {
  // Verificar si el usuario que hace la petición es administrador
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    return { success: false, error: 'No autorizado. Por favor inicia sesión.' }
  }

  const payload = await getPayload({ config: await configPromise })
  
  // Validar el token actual para asegurar que es un administrador
  try {
    const { user } = await payload.auth({
      headers: new Headers({
        Authorization: `JWT ${token}`
      })
    })

    if (!user || user.role !== 'administrador') {
      return { success: false, error: 'Acceso denegado. Solo un administrador puede crear usuarios.' }
    }
  } catch (error) {
    return { success: false, error: 'Error al verificar los permisos del usuario.' }
  }

  // Extraer datos del formulario
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string || 'vendedor'
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string

  if (!email || !password || !name) {
    return { success: false, error: 'El nombre, correo y contraseña son obligatorios.' }
  }

  try {
    // Crear el nuevo usuario en Payload
    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        role,
        name,
        phone,
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Create user error:', error)
    
    // Check for duplicate email error from Postgres/Payload
    if (error.message?.includes('duplicate') || error.message?.includes('exists')) {
       return { success: false, error: 'Ya existe un usuario con este correo electrónico.' }
    }
    
    return { success: false, error: error.message || 'Ocurrió un error al crear el usuario.' }
  }
}
