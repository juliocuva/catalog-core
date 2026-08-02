const fs = require('fs'); 
let content = fs.readFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx', 'utf8');

// Replace the missing search icon
content = content.replace(
  /<div className="flex items-center gap-2">\s*\{\/\* Admin \(Desktop\) \*\/\}/g,
  `<div className="flex items-center gap-4 text-brand-primary">
            {/* Search */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            {/* Admin (Desktop) */}`
);

fs.writeFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx', content);
