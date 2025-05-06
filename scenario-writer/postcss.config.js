import tailwindcssPlugin from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import tailwindConfig from './tailwind.config.js';

export default {
  plugins: [
    tailwindcssPlugin(tailwindConfig),
    autoprefixer,
  ],
} 