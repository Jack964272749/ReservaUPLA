/** @type {import('tailwindcss').Config} */
// Paleta y tipografía tomadas de la intranet UPLA (intranet.upla.edu.pe):
//  - Azul institucional: #3498db / #2d80b9 / #007cbc
//  - Azul marino del panel: #061426
//  - Fondo claro #f4f6fa, bordes #e1e6ec, texto #23303f
//  - Tipografía: Montserrat
// Al redefinir "sky" y "slate", todas las clases existentes (bg-sky-600, dark:bg-slate-900, etc.)
// adoptan automáticamente los colores de la marca en todos los módulos.
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        sky: {
          50: '#eff7fc',
          100: '#dcedf8',
          200: '#bcdcf1',
          300: '#8cc5e8',
          400: '#55a9de',
          500: '#3498db',
          600: '#2d80b9',
          700: '#25689a',
          800: '#1f5479',
          900: '#1a4563',
          950: '#0f2b40',
        },
        slate: {
          50: '#f4f6fa',
          100: '#e9edf3',
          200: '#e1e6ec',
          300: '#c8d0db',
          400: '#a7b0bd',
          500: '#6b7685',
          600: '#4a5667',
          700: '#34414f',
          800: '#1a2b42',
          900: '#0b1c33',
          950: '#050f1d',
        },
        upla: {
          50: '#eff7fc',
          100: '#dcedf8',
          500: '#3498db',
          600: '#2d80b9',
          700: '#25689a',
          800: '#1f5479',
          900: '#061426',
          marino: '#061426',
          fondo: '#f4f6fa',
        }
      }
    },
  },
  plugins: [],
}
