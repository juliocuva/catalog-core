import Link from 'next/link'

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="bg-brand-light-gray min-h-screen flex flex-col overflow-x-hidden selection:bg-brand-accent selection:text-white font-sans">
      
      {/* Editorial Navbar */}
      <header className="absolute top-0 left-0 w-full z-50 py-8 px-6 md:px-12 flex justify-between items-center">
        <div className="font-black text-3xl md:text-4xl tracking-tighter text-brand-primary">
          DTMS
        </div>
        <nav className="hidden md:flex gap-12 items-center">
          <Link href="#editorial" className="text-xs font-bold text-brand-primary uppercase tracking-widest hover:text-brand-accent transition-colors">Manifiesto</Link>
          <Link href="#tendencias" className="text-xs font-bold text-brand-primary uppercase tracking-widest hover:text-brand-accent transition-colors">Tendencias</Link>
          <Link href="/catalogo" className="text-xs font-black text-white bg-brand-primary px-6 py-3 rounded-full hover:bg-brand-accent transition-colors shadow-lg">
            Catálogo
          </Link>
        </nav>
        {/* Mobile Menu Icon */}
        <div className="md:hidden text-brand-primary">
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </div>
      </header>

      <main className="flex-1">
        
        {/* Hero Cover (Magazine Style) */}
        <section className="relative h-[100dvh] min-h-[700px] w-full flex items-center justify-center pt-20 overflow-hidden">
          
          {/* Huge Typography Background */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none select-none">
            <h1 className="text-[28vw] font-black leading-none text-brand-gray/20 tracking-tighter uppercase whitespace-nowrap">
              FASHION
            </h1>
            <h1 className="text-[22vw] font-black leading-none text-brand-gray/20 tracking-tighter uppercase whitespace-nowrap -mt-[8vw]">
              VOL. 1
            </h1>
          </div>
          
          {/* Center Image (Alpha PNG) overlapping text */}
          <div className="relative z-10 w-full max-w-5xl h-[80vh] flex items-center justify-center mt-10 md:mt-0">
            {/* Using a high quality transparent fashion PNG */}
            <img 
              src="https://cdn.shopify.com/s/files/1/0754/3727/7491/files/t-shirt-1.png" 
              alt="Editorial Cover" 
              className="object-contain w-full h-full transform scale-[1.3] md:scale-[1.7] drop-shadow-[0_40px_80px_rgba(17,45,66,0.25)] z-20 hover:scale-[1.8] transition-transform duration-1000 ease-out cursor-pointer" 
            />
            
            {/* Foreground Overlapping Typography */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-full text-center z-30 pointer-events-none mix-blend-exclusion">
               <h2 className="text-7xl md:text-[140px] font-black text-white tracking-tighter leading-[0.85]">NUEVA<br/>ERA</h2>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute bottom-16 right-8 md:right-0 bg-brand-accent text-white px-6 py-4 rounded-full flex flex-col items-center justify-center shadow-2xl rotate-12 z-40">
               <span className="text-[10px] font-bold uppercase tracking-widest">Edición</span>
               <span className="text-2xl font-black">N° 01</span>
            </div>
          </div>

          <div className="absolute bottom-12 left-6 md:left-12 z-40 max-w-xs md:max-w-sm hidden md:block">
            <p className="text-brand-primary font-light text-sm md:text-base leading-relaxed border-l-2 border-brand-accent pl-5">
              La línea divisoria entre el diseño utilitario y la alta costura corporativa nunca ha sido tan fina.
            </p>
          </div>
          
          <div className="absolute bottom-10 md:bottom-12 right-1/2 translate-x-1/2 md:translate-x-0 md:right-12 z-40">
             <Link href="/catalogo" className="group flex items-center gap-4 bg-brand-primary text-brand-light-gray px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-accent transition-colors duration-500 shadow-2xl">
               Ver Colección
               <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
             </Link>
          </div>
        </section>

        {/* Editorial Text Block */}
        <section id="editorial" className="py-32 md:py-48 px-6 md:px-12 bg-white text-brand-primary relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="md:col-span-6">
              <h2 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter">
                ESTILO.<br/>FUNCIÓN.<br/><span className="text-brand-accent">IDENTIDAD.</span>
              </h2>
            </div>
            <div className="md:col-span-6">
              <p className="text-xl md:text-3xl font-light leading-relaxed text-gray-600">
                Redefinimos el estándar del vestuario corporativo. Cada hilo, cada corte y cada silueta está diseñada para proyectar la mejor versión de tu equipo, sin comprometer el confort. Bienvenidos a la <span className="font-bold text-brand-primary">nueva vanguardia</span> industrial.
              </p>
              <div className="mt-12 flex items-center gap-6">
                <div className="h-[2px] w-24 bg-brand-accent"></div>
                <span className="uppercase text-xs font-black tracking-widest text-brand-accent">Manifiesto DTMS</span>
              </div>
            </div>
          </div>
        </section>

        {/* Asymmetrical Featured Grid */}
        <section id="tendencias" className="py-24 md:py-32 px-6 md:px-12 bg-brand-light-gray">
           <div className="max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
               <h3 className="text-4xl md:text-6xl font-black text-brand-primary tracking-tighter">TRENDING NOW</h3>
               <Link href="/catalogo" className="text-xs font-black uppercase tracking-widest text-brand-accent hover:text-brand-primary transition-colors pb-2 border-b-2 border-brand-accent hover:border-brand-primary">
                 Explorar Editorial Completo
               </Link>
             </div>
             
             {/* Editorial Grid Layout */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
               {/* Large Featured Item */}
               <Link href="/catalogo" className="md:col-span-2 relative group overflow-hidden bg-white rounded-none aspect-[4/5] md:aspect-auto md:h-[700px] shadow-sm block">
                  <div className="absolute inset-0 bg-brand-light-blue/10"></div>
                  <img src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1200&auto=format&fit=crop" alt="Colección Principal" className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
                  <div className="absolute bottom-10 left-10 z-10">
                    <span className="bg-brand-accent text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest mb-4 inline-block">Must Have</span>
                    <h4 className="text-4xl md:text-6xl font-black text-white mix-blend-difference leading-none">Camisa<br/>Formal Fit</h4>
                  </div>
               </Link>
               
               {/* Two stacked smaller items */}
               <div className="flex flex-col gap-8 md:gap-12">
                 <Link href="/catalogo" className="relative group overflow-hidden bg-white rounded-none aspect-square shadow-sm flex items-center justify-center block">
                    <div className="absolute inset-0 bg-gray-100"></div>
                    <img src="https://cdn.shopify.com/s/files/1/0754/3727/7491/files/t-shirt-1.png" alt="Básicos" className="w-3/4 h-3/4 object-contain z-10 group-hover:scale-125 group-hover:-rotate-6 transition-all duration-700 drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)]" />
                    <div className="absolute top-8 left-8 z-20">
                      <h4 className="text-3xl font-black text-brand-primary leading-none">Urban<br/>Essentials</h4>
                    </div>
                 </Link>
                 
                 <Link href="/catalogo" className="relative group overflow-hidden bg-white rounded-none aspect-square shadow-sm block">
                    <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop" alt="Calzado" className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
                    <div className="absolute bottom-8 left-8 z-10">
                      <h4 className="text-3xl font-black text-white mix-blend-difference leading-none">Sneakers<br/>Premium</h4>
                    </div>
                 </Link>
               </div>
             </div>
           </div>
        </section>

      </main>

      {/* Editorial Footer */}
      <footer className="bg-brand-primary text-brand-light-gray py-24 px-6 md:px-12 border-t-[20px] border-brand-accent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
          <div className="max-w-2xl">
             <h2 className="text-[120px] font-black tracking-tighter mb-4 text-white leading-none">DTMS.</h2>
             <p className="text-xl md:text-2xl font-light text-brand-light-blue/70">
               El futuro de la dotación corporativa. <br/>Diseñado y confeccionado para el mundo.
             </p>
          </div>
          
          <div className="flex flex-col gap-6 text-xs font-black uppercase tracking-widest text-brand-light-blue/50">
            <Link href="/catalogo" className="hover:text-brand-accent transition-colors">Descubrir Catálogo</Link>
            <a href="/admin" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">Panel de Administración</a>
            <a href="#" className="hover:text-brand-accent transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-accent transition-colors">Contacto Corporativo</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
