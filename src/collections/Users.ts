import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Only admins can create or delete users
    create: ({ req: { user } }) => user?.role === 'administrador',
    delete: ({ req: { user } }) => user?.role === 'administrador',
    // Admins can update anyone, others can only update themselves
    update: ({ req: { user } }) => {
      if (user?.role === 'administrador') return true
      if (user) {
        return {
          id: {
            equals: user.id,
          },
        }
      }
      return false
    },
    // Anyone logged in can read users
    read: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'phone',
      type: 'text',
      label: 'Teléfono',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rol',
      required: true,
      defaultValue: 'asesor',
      options: [
        { label: 'Administrador', value: 'administrador' },
        { label: 'Comercial', value: 'comercial' },
        { label: 'Diseñador', value: 'diseñador' },
        { label: 'Asesor', value: 'asesor' },
      ],
    },
  ],
}
