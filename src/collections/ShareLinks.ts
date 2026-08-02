import { CollectionConfig } from 'payload'

export const ShareLinks: CollectionConfig = {
  slug: 'share-links',
  admin: {
    useAsTitle: 'clientName',
  },
  access: {
    read: () => true, // Everyone can read (we might want to restrict this in production)
    create: () => true, // Allow frontend to create
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
      label: 'Nombre del Cliente',
    },
    {
      name: 'uniqueCode',
      type: 'text',
      required: true,
      unique: true,
      label: 'Código Único',
    },
    {
      name: 'clicks',
      type: 'number',
      defaultValue: 0,
      label: 'Clics (Aperturas)',
    }
  ],
}
