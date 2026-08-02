const fs = require('fs');
const path = 'c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove MOCK_CATEGORIES and MOCK_PRODUCTS definitions
content = content.replace(/\/\/ Mockup Data[\s\S]*?(?=export default function CatalogClient)/, '');

// 2. Change filteredProducts logic and add API call
content = content.replace(/const filteredProducts = [\s\S]*?MOCK_PRODUCTS;/m, `const mappedProducts = initialProducts.map(p => ({
    id: p.id,
    name: p.name,
    brand: p.brand?.name || 'General',
    categoryId: p.category?.id || (p.category ? p.category : null),
    image: p.mockImageUrl || p.images?.[0]?.image?.url || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop',
    isNew: p.isNew || false
  }));

  const filteredProducts = selectedCategoryId 
    ? mappedProducts.filter(p => p.categoryId === selectedCategoryId)
    : mappedProducts;`);

// 3. Update handleGenerateLink
const apiCall = `const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const clientName = (form.elements[0] as HTMLInputElement).value;
    
    try {
      const response = await fetch('/api/share-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          uniqueCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        }),
      });
      const data = await response.json();
      
      if(data.doc) {
        setGeneratedLink(\`catalogo.empresa.com/s/\${data.doc.uniqueCode}\`);
        setIsLinkGenerated(true);
      }
    } catch(err) {
      console.error('Error generating link', err);
    }
  };`;
content = content.replace(/const handleGenerateLink = \([\s\S]*?\};\n/m, apiCall + '\n');

// 4. Update MOCK_CATEGORIES usages
content = content.replaceAll('MOCK_CATEGORIES', 'initialCategories');

// 5. Update cat.icon rendering to dangerouslySetInnerHTML because it's a string from DB
content = content.replace(/<div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 mb-3 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">[\s\S]*?\{cat\.icon\}[\s\S]*?<\/div>/m, 
`<div 
  className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 mb-3 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300"
  dangerouslySetInnerHTML={{ __html: cat.icon }}
/>`);

fs.writeFileSync(path, content);
console.log('Done!');
