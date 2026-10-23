import Link from 'next/link'

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="bg-brand-light-gray min-h-screen flex flex-col overflow-x-hidden selection:bg-brand-accent selection:text-white font-sans">
      
      {/* Editorial Navbar */}
      <header className="absolute top-0 left-0 w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/guapura%20logo_Mesa%20de%20trabajo%201.png"
            alt="Guapura Boutique"
            className="h-14 md:h-20 w-auto object-contain"
          />
        </Link>
        <nav className="hidden md:flex gap-10 items-center">
          <Link href="#manifiesto" className="text-xs font-bold text-brand-primary uppercase tracking-widest hover:text-brand-accent transition-colors">
            Filosofía
          </Link>
          <Link href="#categorias" className="text-xs font-bold text-brand-primary uppercase tracking-widest hover:text-brand-accent transition-colors">
            Colección
          </Link>
          <Link href="#tendencias" className="text-xs font-bold text-brand-primary uppercase tracking-widest hover:text-brand-accent transition-colors">
            Tendencias
          </Link>
          <Link href="/catalogo" className="text-xs font-black text-white bg-brand-primary px-6 py-3 rounded-full hover:bg-brand-accent transition-all shadow-lg hover:shadow-brand-primary/30">
            Ver Catálogo
          </Link>
        </nav>
        {/* Mobile Menu CTA */}
        <div className="md:hidden">
          <Link href="/catalogo" className="text-xs font-bold text-white bg-brand-primary px-4 py-2.5 rounded-full shadow">
            Catálogo
          </Link>
        </div>
      </header>

      <main className="flex-1">
        
        {/* Hero Cover (Magazine Style - Joven & Ejecutiva) */}
        <section className="relative min-h-[100dvh] w-full flex items-center justify-center pt-24 pb-16 px-6 md:px-12 overflow-hidden">
          
          {/* Huge Typography Background */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none select-none">
            <h1 className="text-[22vw] font-black leading-none text-brand-primary/5 tracking-tighter uppercase whitespace-nowrap">
              GUAPURA
            </h1>
            <h1 className="text-[18vw] font-black leading-none text-brand-primary/5 tracking-tighter uppercase whitespace-nowrap -mt-[5vw]">
              EXECUTIVE
            </h1>
          </div>
          
          {/* Hero Visual Container */}
          <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-8 md:pt-4">
            
            {/* Left Content / Intro */}
            <div className="md:col-span-5 flex flex-col items-start z-30 order-2 md:order-1">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-light-blue text-brand-primary text-[11px] font-bold tracking-widest uppercase mb-4">
                Colección Femenina Ejecutiva
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-brand-primary leading-[0.95] tracking-tight mb-6">
                Elegancia con<br />
                <span className="font-script text-brand-accent font-normal text-5xl md:text-7xl lowercase block mt-1">
                  actitud propia
                </span>
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-md">
                Prendas de sastrería fluida, blusas impecables, vestidos sofisticados y calzado de autor para mujeres dinámicas que destacan en la oficina y brillan en cada evento.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Link 
                  href="/catalogo" 
                  className="bg-brand-primary text-white font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-all duration-300 shadow-xl shadow-brand-primary/25 flex items-center gap-2 group"
                >
                  <span>Explorar Prendas</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <a
                  href="https://api.whatsapp.com/send?phone=573113421026&text=Hola%20Guapura%20Boutique%2C%20quisiera%20asesor%C3%ADa%20personalizada%20para%20un%20look%20ejecutivo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-brand-primary/20 text-brand-primary font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider hover:bg-white hover:border-brand-primary transition-colors"
                >
                  Asesoría WhatsApp
                </a>
              </div>
            </div>

            {/* Right Centerpiece Image (Young Executive Woman) */}
            <div className="md:col-span-7 relative z-20 flex justify-center items-center order-1 md:order-2">
              <div className="relative w-full max-w-md md:max-w-lg aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_30px_90px_-20px_rgba(153,56,149,0.35)] border-4 border-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop" 
                  alt="Mujer Joven Ejecutiva - Guapura Boutique" 
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-1000 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/60 via-transparent to-transparent pointer-events-none"></div>

                {/* Overlaid Badges */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-gray-100">
                  <span className="text-[10px] font-bold text-brand-accent tracking-widest uppercase block">Línea</span>
                  <span className="text-sm font-black text-brand-primary">Executive Chic</span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-brand-accent px-2.5 py-1 rounded inline-block mb-1.5">
                    Smart Casual
                  </span>
                  <p className="text-xs text-white/90 font-light leading-snug">
                    De la sala de juntas a la cena con amigas, con la soltura y distinción que te caracteriza.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* Categories Bar (Pantalones, Blusas, Vestidos, Calzado) */}
        <section id="categorias" className="py-16 px-6 md:px-12 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">Colección Esencial</span>
              <h3 className="text-3xl md:text-4xl font-black text-brand-primary tracking-tight mt-1">
                Cuatro pilares de tu <span className="font-script lowercase text-brand-accent text-3xl md:text-4xl font-normal">guardarropa</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { 
                  name: 'Pantalones', 
                  desc: 'Tiro alto & sastre', 
                  href: '/catalogo', 
                  image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop' 
                },
                { 
                  name: 'Blusas', 
                  desc: 'Satín & cortes ejecutivos', 
                  href: '/catalogo', 
                  image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=800&auto=format&fit=crop' 
                },
                { 
                  name: 'Vestidos', 
                  desc: 'Siluetas midi & gala', 
                  href: '/catalogo', 
                  image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop' 
                },
                { 
                  name: 'Calzado', 
                  desc: 'Stilettos & tacón chic', 
                  href: '/catalogo', 
                  image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop' 
                },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="group relative aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 block bg-gray-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="font-black text-lg md:text-xl tracking-tight leading-none mb-1 group-hover:text-brand-light-blue transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-white/80 font-light truncate">
                      {item.desc}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/90 group-hover:translate-x-1 transition-transform">
                      Ver colección →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Editorial Text Block (Filosofía Guapura) */}
        <section id="manifiesto" className="py-24 md:py-36 px-6 md:px-12 bg-brand-light-gray text-brand-primary relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="md:col-span-6">
              <span className="text-xs font-black uppercase tracking-widest text-brand-accent block mb-3">Manifiesto Guapura Boutique</span>
              <h2 className="text-5xl md:text-7xl font-black leading-[0.92] tracking-tighter">
                SOFISTICADA.<br/>VERSÁTIL.<br/>
                <span className="text-brand-accent font-script font-normal text-5xl md:text-8xl lowercase tracking-normal block mt-2">auténtica.</span>
              </h2>
            </div>
            <div className="md:col-span-6">
              <p className="text-lg md:text-2xl font-light leading-relaxed text-gray-700 mb-6">
                Diseñado exclusivamente para mujeres que lideran sus carreras, proyectos y vida con firmeza, seguridad y elegancia.
              </p>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Creemos que la ropa ejecutiva moderna no tiene por qué ser aburrida ni rígida. Seleccionamos prendas de caída impecable, texturas agradables y calzado estilizado que proyectan seguridad y buen gusto desde el primer momento.
              </p>
              <div className="mt-8 flex items-center gap-6">
                <div className="h-[2px] w-20 bg-brand-accent"></div>
                <span className="uppercase text-xs font-black tracking-widest text-brand-primary">Poder Femenino Contemporáneo</span>
              </div>
            </div>
          </div>
        </section>

        {/* Asymmetrical Featured Grid (Visual Outfits) */}
        <section id="tendencias" className="py-24 md:py-32 px-6 md:px-12 bg-white">
           <div className="max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
               <div>
                 <span className="text-xs font-bold uppercase tracking-widest text-brand-accent block mb-1">Inspiración de Outfits</span>
                 <h3 className="text-4xl md:text-6xl font-black text-brand-primary tracking-tighter">
                   TENDENCIAS <span className="font-script font-normal text-brand-accent text-4xl md:text-6xl lowercase tracking-normal inline-block ml-3">ejecutivas</span>
                 </h3>
               </div>
               <Link href="/catalogo" className="text-xs font-black uppercase tracking-widest text-brand-accent hover:text-brand-primary transition-colors pb-2 border-b-2 border-brand-accent hover:border-brand-primary">
                 Ver Catálogo de Prendas
               </Link>
             </div>
             
             {/* Editorial Grid Layout */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
               {/* Large Featured Item (Vestidos & Sastrería) */}
               <Link href="/catalogo" className="md:col-span-2 relative group overflow-hidden bg-white rounded-3xl aspect-[4/5] md:aspect-auto md:h-[650px] shadow-sm block">
                  <div className="absolute inset-0 bg-brand-light-blue/20"></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop" 
                    alt="Vestidos y Sastrería Femenina" 
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-1000" 
                  />
                  <div className="absolute bottom-8 left-8 z-10 text-white">
                    <span className="bg-brand-accent text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest mb-3 inline-block rounded-full shadow">
                      Look Ejecutiva
                    </span>
                    <h4 className="text-3xl md:text-5xl font-black mix-blend-difference leading-none">
                      Vestidos & Sastrería<br/><span className="font-script font-normal lowercase text-4xl md:text-6xl">de impacto</span>
                    </h4>
                  </div>
               </Link>
               
               {/* Two stacked smaller items */}
               <div className="flex flex-col gap-8 md:gap-12">
                 {/* Item 1: Pantalones & Blusas */}
                 <Link href="/catalogo" className="relative group overflow-hidden bg-white rounded-3xl aspect-square shadow-sm flex items-center justify-center block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800&auto=format&fit=crop" 
                      alt="Pantalones y Blusas Ejecutivas" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 z-20 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-brand-light-blue block mb-1">Básicos Esenciales</span>
                      <h4 className="text-2xl font-black leading-none">
                        Pantalones & Blusas<br/><span className="font-script font-normal text-brand-light-blue lowercase text-2xl">smart casual</span>
                      </h4>
                    </div>
                 </Link>
                 
                 {/* Item 2: Calzado de Mujer */}
                 <Link href="/catalogo" className="relative group overflow-hidden bg-white rounded-3xl aspect-square shadow-sm block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop" 
                      alt="Calzado y Tacones Elegantes" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 z-10 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-brand-light-blue block mb-1">Elegancia a Cada Paso</span>
                      <h4 className="text-2xl font-black leading-none">
                        Calzado & Stilettos<br/><span className="font-script font-normal lowercase text-2xl md:text-3xl">de autor</span>
                      </h4>
                    </div>
                 </Link>
               </div>
             </div>
           </div>
        </section>

      </main>

      {/* Editorial Footer */}
      <footer className="bg-brand-primary text-brand-light-gray py-20 px-6 md:px-12 border-t-[12px] border-brand-accent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="max-w-xl">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img
               src="/guapura%20logo_Mesa%20de%20trabajo%201.png"
               alt="Guapura Boutique"
               className="h-20 md:h-28 w-auto object-contain mb-6 brightness-0 invert"
             />
             <p className="text-lg md:text-xl font-light text-brand-light-blue/80 leading-relaxed">
               Moda contemporánea, prendas y calzado pensados para la mujer joven, ejecutiva y auténtica.
             </p>
          </div>
          
          <div className="flex flex-col gap-4 text-xs font-black uppercase tracking-widest text-brand-light-blue/60">
            <Link href="/catalogo" className="hover:text-white transition-colors">Ver Catálogo Virtual</Link>
            <a href="/admin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Acceso Administrativo</a>
            <a href="https://api.whatsapp.com/send?phone=573113421026&text=Hola%20Guapura%20Boutique%2C%20quiero%20conocer%20la%20nueva%20colecci%C3%B3n" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-light-blue transition-colors flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              <span>WhatsApp: 311 342 1026</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
