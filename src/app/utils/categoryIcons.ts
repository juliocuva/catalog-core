export function getCategoryIconSvg(name: string, customIcon?: string | null): string {
  const n = (name || '').toLowerCase().trim();

  // 1. Relojes / Smartwatch
  if (n.includes('reloj') || n.includes('watch')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="12" cy="12" r="6"/><polyline points="12 10 12 12 13.5 13.5"/><path d="m16.13 7.66-.8-3.04a2 2 0 0 0-1.93-1.49h-2.8a2 2 0 0 0-1.93 1.49l-.8 3.04"/><path d="m7.87 16.34.8 3.04a2 2 0 0 0 1.93 1.49h2.8a2 2 0 0 0 1.93-1.49l.8-3.04"/></svg>`;
  }

  // 2. Bolsos / Carteras / Mochilas
  if (n.includes('bolso') || n.includes('cartera') || n.includes('bolsa') || n.includes('mochila') || n.includes('billetera')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
  }

  // 3. Accesorios / Joyas / Anillos / Collares
  if (n.includes('joya') || n.includes('accesorio') || n.includes('anillo') || n.includes('collar') || n.includes('pulsera') || n.includes('arete')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>`;
  }

  // 4. Gafas / Lentes
  if (n.includes('gafa') || n.includes('lente')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-4 0"/><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"/><path d="M21.5 13 19 7c-.7-1.3-1.4-2-3-2"/></svg>`;
  }

  // 5. Calzado / Zapatos / Tenis / Sandalias / Tacones
  if (n.includes('calzado') || n.includes('zapato') || n.includes('teni') || n.includes('sandalia') || n.includes('tacon') || n.includes('bota')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M3 17h18l-1.5-5-4.5-1-4 3H3v3z"/><path d="M3 17v2a1 1 0 0 0 1 1h4v-3"/><path d="M19 17v2a1 1 0 0 0 1 1h1v-3"/></svg>`;
  }

  // 6. Pantalones / Jeans / Shorts / Bermudas
  if (n.includes('pantalon') || n.includes('jean') || n.includes('short') || n.includes('bermuda') || n.includes('leggin')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M6 3h12v4l-2 14h-3l-1-9-1 9H8L6 7V3z"/></svg>`;
  }

  // 7. Vestidos / Faldas / Enterizos
  if (n.includes('vestido') || n.includes('falda') || n.includes('enterizo')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M8 3h8l1 6-3 2 4 10H6l4-10-3-2 1-6z"/><path d="M10 3a2 2 0 0 0 4 0"/></svg>`;
  }

  // 8. Blusas / Camisas / Tops / Chaquetas
  if (n.includes('blusa') || n.includes('camisa') || n.includes('top') || n.includes('chaqueta') || n.includes('buzo') || n.includes('sueter')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`;
  }

  // If a valid custom icon SVG is explicitly provided and isn't the generic hanger fallback
  if (customIcon && customIcon.includes('<svg') && !customIcon.includes('M12 2a3 3 0 0 0-3 3')) {
    return customIcon;
  }

  // Default elegant hanger icon
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M12 2a3 3 0 0 0-3 3c0 1.3.8 2.4 2 2.8V9l-8.5 7.5A2 2 0 0 0 4 20h16a2 2 0 0 0 1.5-3.5L13 9V7.8c1.2-.4 2-1.5 2-2.8a3 3 0 0 0-3-3z"/></svg>`;
}
