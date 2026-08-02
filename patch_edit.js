const fs = require('fs');
let content = fs.readFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx', 'utf8');

// 1. Add import
if (!content.includes('updateProduct')) {
  content = content.replace(
    /import \{ uploadProduct \} from '@\/app\/actions\/uploadProduct'/g,
    `import { uploadProduct } from '@/app/actions/uploadProduct'\nimport { updateProduct } from '@/app/actions/updateProduct'`
  );
}

// 2. Add state for editingProduct
if (!content.includes('editingProduct')) {
  content = content.replace(
    /const \[isUploading, setIsUploading\] = useState\(false\);/g,
    `const [isUploading, setIsUploading] = useState(false);\n  const [editingProduct, setEditingProduct] = useState<any>(null);`
  );
}

// 3. Modify handleUploadProduct
const newHandler = `
  const handleUploadProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, formData);
    } else {
      result = await uploadProduct(formData);
    }
    
    setIsUploading(false);
    if (result.success) {
      setIsUploadModalOpen(false);
      setEditingProduct(null);
    } else {
      alert('Error: ' + result.error);
    }
  };
`;
// Replace the old handleUploadProduct
content = content.replace(
  /const handleUploadProduct = async \([\s\S]*?alert\('Error: ' \+ result\.error\);\n\s*\}\n\s*\};/g,
  newHandler.trim()
);

// Modify Admin buttons to ensure editingProduct is cleared
content = content.replace(
  /onClick=\{\(\) => setIsUploadModalOpen\(true\)\}/g,
  `onClick={() => { setEditingProduct(null); setIsUploadModalOpen(true); }}`
);
content = content.replace(
  /onClick=\{\(\) => setIsUploadModalOpen\(false\)\}/g,
  `onClick={() => { setIsUploadModalOpen(false); setEditingProduct(null); }}`
);


// 4. Add Edit button to product card (top-2 right-12)
const editBtn = `
                <button onClick={(e) => { e.preventDefault(); setEditingProduct(product); setIsUploadModalOpen(true); }} className="absolute top-2 right-12 z-20 bg-white shadow-sm p-1.5 rounded-full text-brand-primary hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100" title="Editar producto">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
`;
if (!content.includes('setEditingProduct(product)')) {
  content = content.replace(
    /(<button onClick=\{\(e\) => \{ e\.preventDefault\(\); handleDeleteProduct\(product\.id\).*?<\/button>\s*)/g,
    `$1${editBtn}`
  );
}


// 5. Update the Modal UI to reflect editingProduct defaults
content = content.replace(
  /Crear Nuevo Producto/g,
  `{editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}`
);

content = content.replace(
  /name="name" placeholder="Ej. Tenis Runner"/g,
  `name="name" defaultValue={editingProduct?.name || ''} placeholder="Ej. Tenis Runner"`
);

content = content.replace(
  /name="categoryId" className="w-full/g,
  `name="categoryId" defaultValue={editingProduct?.categoryId || ''} className="w-full`
);

content = content.replace(
  /required type="file" name="image"/g,
  `{...(editingProduct ? {} : {required: true})} type="file" name="image"`
);

content = content.replace(
  /name="isNew" id="isNew" value="true"/g,
  `name="isNew" id="isNew" value="true" defaultChecked={editingProduct?.isNew || false}`
);

content = content.replace(
  /Creando producto\.\.\./g,
  `{editingProduct ? 'Guardando...' : 'Creando producto...'}`
);

content = content.replace(
  />\s*Crear Producto\s*<\/button>/g,
  `>{editingProduct ? 'Guardar Cambios' : 'Crear Producto'}</button>`
);

content = content.replace(
  /Recomendado: PNG con fondo transparente/g,
  `{editingProduct ? 'Sube una imagen solo si deseas cambiar la actual' : 'Recomendado: PNG con fondo transparente'}`
);


fs.writeFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx', content);
