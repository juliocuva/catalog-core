'use client';

import { useState } from 'react';
import Link from 'next/link';

export function ProductGallery({ images, productName }: { images: string[]; productName: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = images[selectedIndex] || images[0];

  return (
    <div className="w-full md:w-1/2 bg-gray-100 relative min-h-[50vh] md:min-h-screen flex flex-col items-center justify-center pt-16 md:pt-0">
      {/* Desktop Back button */}
      <Link href="/catalogo" className="hidden md:flex absolute top-8 left-8 p-3 bg-white rounded-full text-gray-900 shadow-sm hover:scale-105 transition z-10">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      </Link>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={activeImage}
        alt={productName}
        className="w-full h-full max-h-[72vh] object-contain mix-blend-multiply p-6 md:p-8"
      />

      {images.length > 1 && (
        <div className="flex gap-3 pb-6 px-4 z-10">
          {images.map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all bg-white ${
                selectedIndex === idx ? 'border-brand-primary scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgUrl} alt={`${productName} ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CopyProductLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error copying URL:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex-1 border-2 border-brand-primary text-brand-primary font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-brand-light-blue/40 transition"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
      {copied ? '¡Link Copiado!' : 'Copiar Link'}
    </button>
  );
}
