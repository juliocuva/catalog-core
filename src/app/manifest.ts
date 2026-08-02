import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CatalogCore',
    short_name: 'CatalogCore',
    description: 'Catálogo Digital Corporativo',
    start_url: '/catalogo',
    display: 'standalone',
    background_color: '#EFEFEF',
    theme_color: '#112D42',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
