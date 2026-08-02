import { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Categoría padre (para crear subcategorías).',
      }
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Código SVG del ícono o identificador.',
      }
    },
  ],
}
