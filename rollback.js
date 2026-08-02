const fs = require('fs'); 

// 1. Remove files
try { fs.unlinkSync('c:/DTMS/catalog-core/src/components/TransitionContext.tsx'); } catch(e){}
try { fs.unlinkSync('c:/DTMS/catalog-core/src/components/LegoTransition.tsx'); } catch(e){}
try { fs.unlinkSync('c:/DTMS/catalog-core/src/components/TransitionLink.tsx'); } catch(e){}

// 2. Revert layout.tsx
let layout = fs.readFileSync('c:/DTMS/catalog-core/src/app/(frontend)/layout.tsx', 'utf8');
layout = layout.replace(/import \{ TransitionProvider \} from \"@\/components\/TransitionContext\";\n/g, '');
layout = layout.replace(/import LegoTransition from \"@\/components\/LegoTransition\";\n/g, '');
layout = layout.replace(/<TransitionProvider>\n\s*<LegoTransition \/>\n\s*\{children\}\n\s*<\/TransitionProvider>/g, '{children}');
fs.writeFileSync('c:/DTMS/catalog-core/src/app/(frontend)/layout.tsx', layout);

// 3. Revert page.tsx
let page = fs.readFileSync('c:/DTMS/catalog-core/src/app/(frontend)/page.tsx', 'utf8');
page = page.replace(/import TransitionLink from '@\/components\/TransitionLink'\n/g, '');
page = page.replace(/<TransitionLink/g, '<Link');
page = page.replace(/<\/TransitionLink>/g, '</Link>');
fs.writeFileSync('c:/DTMS/catalog-core/src/app/(frontend)/page.tsx', page);

// 4. Revert CatalogClient.tsx
let catalog = fs.readFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx', 'utf8');
catalog = catalog.replace(/import TransitionLink from '@\/components\/TransitionLink';\n/g, "import Link from 'next/link';\n");
catalog = catalog.replace(/<TransitionLink/g, '<Link');
catalog = catalog.replace(/<\/TransitionLink>/g, '</Link>');
fs.writeFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/CatalogClient.tsx', catalog);

// 5. Revert [id]/page.tsx
let detail = fs.readFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/[id]/page.tsx', 'utf8');
detail = detail.replace(/import TransitionLink from '@\/components\/TransitionLink'\n/g, "import Link from 'next/link'\n");
detail = detail.replace(/<TransitionLink/g, '<Link');
detail = detail.replace(/<\/TransitionLink>/g, '</Link>');
fs.writeFileSync('c:/DTMS/catalog-core/src/app/(frontend)/catalogo/[id]/page.tsx', detail);

console.log('Rollback complete');
