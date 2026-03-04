# 🍲 Cocina Argentina - Plataforma de Comunidad Gastronómica

> Una aplicación web profesional y social para explorar, crear y compartir el sabor de la cocina tradicional argentina. Desarrollada con un stack moderno enfocado en la comunidad, la persistencia de datos y una experiencia de usuario (UX) de alto nivel.

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)](https://clerk.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap)](https://getbootstrap.com)

## 🚀 Características Principales

### �🇷 Contenido y Comunidad

- **Recetario Completo**: Colección de platos tradicionales con ingredientes, instrucciones detalladas y tiempos.
- **Creación de Recetas**: Los usuarios logueados pueden subir sus propias recetas con imágenes personalizadas.
- **Atribución de Autor**: Cada receta muestra quién la subió, con enlace directo a su perfil.
- **Comunidad Social**: Sistema de comentarios y opiniones en tiempo real para interactuar con otros cocineros.
- **Perfiles Públicos**: Páginas de perfil personalizables con biografía, ocupación, redes sociales (Instagram, X, Facebook) y lista de recetas publicadas.

### 🛠️ Herramientas para el Cocinero

- **Modo Cocina**: Interfaz optimizada con letra grande y prevención de bloqueo de pantalla (Wake Lock API) para seguir instrucciones sin tocar el móvil con las manos sucias.
- **Conversor de Unidades**: Cambia instantáneamente entre sistema métrico e imperial (gramos/ml a onzas).
- **Maridaje con Mate**: Sugerencias inteligentes de acompañamiento con mate según el tipo de receta (dulce o salada).
- **Buscador Avanzado**: Filtros por nombre, ingredientes, categoría y nivel de dificultad.

### 💾 Persistencia y Seguridad

- **Sincronización con Supabase**: Favoritos, calificaciones (estrellas) y comentarios persistentes en la nube.
- **Autenticación con Clerk**: Registro e inicio de sesión seguro, gestión de perfiles y avatares.
- **Favoritos**: Guarda tus recetas preferidas para acceder a ellas rápidamente desde cualquier dispositivo.

## 🛠️ Stack Tecnológico

- **Frontend**: React 19, Vite, React Router v6, Bootstrap 5, React Icons.
- **Backend as a Service (BaaS)**: Supabase (PostgreSQL, RLS).
- **Autenticación**: Clerk (User Management).
- **Estado Global**: React Context API (Recipes, Favorites, Ratings).
- **APIs**: Wake Lock API (Modo Cocina).

## 📂 Estructura del Proyecto

```text
src/
├── components/          # Componentes de la interfaz (Cards, Detail, List, etc.)
│   ├── ui/              # Componentes reutilizables (Skeletons, Spinners, Alerts)
│   └── data/            # Fallback de datos locales (recipes.json)
├── context/             # Gestión de estado global (Auth, Recipes, Favorites)
├── services/            # Cliente de Supabase y lógica de API
├── App.jsx              # Enrutamiento principal
└── main.jsx             # Punto de entrada y configuración de Clerk
```

## ⚙️ Configuración del Entorno

Para ejecutar este proyecto localmente, necesitas configurar las siguientes variables en un archivo `.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=key_de_clerk
VITE_SUPABASE_URL=url_de_supabase
VITE_SUPABASE_ANON_KEY=key_anonima_de_supabase
```

## � Instalación

1. Clona el repositorio: `git clone https://github.com/EzequielTorre/Cocina-Argentina.git`
2. Instala las dependencias: `npm install`
3. Inicia el modo desarrollo: `npm run dev`

---

� **Contacto**: ezequiel.torres0682@gmail.com
🎓 **Estudiante de programación de la academia Talento Tech**
