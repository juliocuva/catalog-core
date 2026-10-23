import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Guapura Boutique',
    short_name: 'Guapura',
    description: 'Catálogo Digital - Guapura Boutique',
    start_url: '/catalogo',
    display: 'standalone',
    background_color: '#FAF7FA',
    theme_color: '#993895',
    icons: [
      {
        src: '/app-icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/app-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/app-icon.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
