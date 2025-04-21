import './bootstrap';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

// createInertiaApp({
//   resolve: name => {
//     const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
//     return pages[`./Pages/${name}.jsx`]
//   },
//   setup({ el, App, props }) {
//     createRoot(el).render(<App {...props} />)
//   },
// })

createInertiaApp({
  resolve: async (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    const page = pages[`./Pages/${name}.jsx`];
    
    if (!page) {
        throw new Error(`Page not found: ${name}`);
    }
    
    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})