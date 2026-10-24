'use client';

import { useState } from 'react';
import Link from 'next/link';

const SAFE_FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23F8FAFC'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394A3B8' font-family='sans-serif' font-weight='600' font-size='15'%3EGuapura Boutique%3C/text%3E%3C/svg%3E";

export function ProductGallery({ images, productName }: { images: string[]; productName: string }) {
  const [failedUrls, setFailedUrls] = useState<string[]>([]);
  const validImages = images.filter((url) => !failedUrls.includes(url));
  const displayImages = validImages.length > 0 ? validImages : [SAFE_FALLBACK_IMAGE];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const safeIndex = selectedIndex < displayImages.length ? selectedIndex : 0;
  const activeImage = displayImages[safeIndex] || displayImages[0];

  const handleImageError = (badUrl: string) => {
    if (badUrl && badUrl !== SAFE_FALLBACK_IMAGE) {
      setFailedUrls((prev) => (prev.includes(badUrl) ? prev : [...prev, badUrl]));
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-gray-100 relative min-h-[50vh] md:min-h-screen flex flex-col items-center justify-center pt-16 md:pt-0">
      {/* Desktop Back button */}
      <Link
        href="/catalogo"
        className="hidden md:flex absolute top-8 left-8 p-3 bg-white rounded-full text-gray-900 shadow-sm hover:scale-105 transition z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </Link>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={activeImage}
        alt={productName}
        onError={(e) => {
          e.currentTarget.onerror = null;
          handleImageError(activeImage);
        }}
        className="w-full h-full max-h-[72vh] object-contain mix-blend-multiply p-6 md:p-8"
      />

      {displayImages.length > 1 && (
        <div className="flex gap-3 pb-6 px-4 z-10 flex-wrap justify-center">
          {displayImages.map((imgUrl, idx) => (
            <button
              key={`${imgUrl}-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all bg-white ${
                safeIndex === idx ? 'border-brand-primary scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt={`${productName} ${idx + 1}`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  handleImageError(imgUrl);
                }}
                className="w-full h-full object-cover"
              />
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
      console.error('Error copying link', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex-1 py-3 px-4 rounded-xl border border-brand-primary text-brand-primary font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-brand-primary/5 transition active:scale-95 shadow-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
      {copied ? '¡Copiado!' : 'Copiar Link'}
    </button>
  );
}
