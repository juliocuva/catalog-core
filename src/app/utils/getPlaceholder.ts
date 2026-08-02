export function getPlaceholderImage(productName: string): string {
  const name = productName.toLowerCase();
  
  // Specific real-looking products to avoid repetition
  if (name.includes('bota de seguridad dielectrica puma')) {
    return 'https://loremflickr.com/800/800/boots,safety?lock=1';
  }
  if (name.includes('bota industrial cat')) {
    return 'https://loremflickr.com/800/800/boots,industrial?lock=2';
  }
  if (name.includes('overol antiflama')) {
    return 'https://loremflickr.com/800/800/coverall,worker?lock=3';
  }
  if (name.includes('uniforme médico antifluido')) {
    return 'https://loremflickr.com/800/800/scrubs,doctor?lock=4';
  }
  if (name.includes('chaqueta impermeable')) {
    return 'https://loremflickr.com/800/800/jacket,safety?lock=5';
  }
  if (name.includes('casco de seguridad tipo ii')) {
    return 'https://loremflickr.com/800/800/helmet,construction?lock=6';
  }
  if (name.includes('guantes de cuero carnaza')) {
    return 'https://loremflickr.com/800/800/gloves,work?lock=7';
  }
  if (name.includes('gafas de seguridad')) {
    return 'https://loremflickr.com/800/800/goggles,safety?lock=8';
  }
  if (name.includes('camisa oxford dotación')) {
    return 'https://loremflickr.com/800/800/shirt,oxford?lock=9';
  }
  if (name.includes('pantalón jean trabajo pesado')) {
    return 'https://loremflickr.com/800/800/jeans,denim?lock=10';
  }
  if (name.includes('botas de caucho')) {
    return 'https://loremflickr.com/800/800/rubber,boots?lock=11';
  }
  if (name.includes('tapabocas industrial')) {
    return 'https://loremflickr.com/800/800/mask,n95?lock=12';
  }
  
  // Generic fallbacks
  if (name.includes('bota') || name.includes('zapato') || name.includes('calzado')) {
    return 'https://loremflickr.com/800/800/boots?lock=101';
  }
  if (name.includes('casco') || name.includes('seguridad')) {
    return 'https://loremflickr.com/800/800/helmet?lock=102';
  }
  if (name.includes('guante')) {
    return 'https://loremflickr.com/800/800/gloves?lock=103';
  }
  if (name.includes('médico') || name.includes('enfermera') || name.includes('scrub')) {
    return 'https://loremflickr.com/800/800/scrubs?lock=104';
  }
  if (name.includes('overol') || name.includes('uniforme')) {
    return 'https://loremflickr.com/800/800/uniform?lock=105';
  }
  if (name.includes('camisa') || name.includes('polo')) {
    return 'https://loremflickr.com/800/800/shirt?lock=106';
  }
  
  return 'https://loremflickr.com/800/800/industrial,equipment?lock=99';
}
