import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['administrador', 'comercial'].includes(user?.role),
    update: ({ req: { user } }) => ['administrador', 'comercial', 'diseñador'].includes(user?.role),
    delete: ({ req: { user } }) => ['administrador', 'comercial'].includes(user?.role),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre del Producto',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          label: 'Categoría',
        },
        {
          name: 'brand',
          type: 'relationship',
          relationTo: 'brands',
          label: 'Marca',
        },
      ]
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descripción',
    },
    {
      name: 'colors',
      type: 'array',
      label: 'Colores',
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Color (ej. Rojo, Azul)',
        }
      ]
    },
    {
      name: 'sizes',
      type: 'array',
      label: 'Tallas',
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Talla (ej. S, M, 38)',
        }
      ]
    },
    {
      name: 'specifications',
      type: 'array',
      label: 'Otras Especificaciones',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nombre (ej. Color)',
        },
        {
          name: 'value',
          type: 'text',
          label: 'Valor (ej. Negro)',
        }
      ]
    },
    {
      name: 'images',
      type: 'array',
      label: 'Galería de Imágenes',
      maxRows: 3,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        }
      ]
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      options: [
        { label: 'Activo', value: 'active' },
        { label: 'Borrador', value: 'draft' },
        { label: 'Archivado', value: 'archived' }
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'isNew',
      type: 'checkbox',
      label: 'Es Nuevo (Mostrar Etiqueta)',
      defaultValue: false,
    },
    {
      name: 'mockImageUrl',
      type: 'text',
      admin: {
        description: 'URL temporal de imagen (solo para seeder/mocks).',
      }
    },
  ],
}
