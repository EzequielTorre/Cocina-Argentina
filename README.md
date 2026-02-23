# 🍲 Cocina Argentina

> Una aplicación web moderna para explorar y compartir recetas tradicionales de la cocina argentina. Desarrollada con React y Vite, enfocada en UX/UI responsivo y performance.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)

## 📋 Tabla de Contenidos

- [Overview](#overview)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Variables de Entorno](#variables-de-entorno)
- [Rutas](#rutas)
- [Características Principales](#características-principales)
- [Despliegue](#despliegue)
- [Contribuciones](#contribuciones)

## 🎯 Overview

**Cocina Argentina** es una SPA (Single Page Application) que permite a los usuarios:

- ✅ Explorar una colección de recetas tradicionales argentinas
- ✅ Buscar y filtrar recetas por nombre
- ✅ Ver detalles completos de cada receta (ingredientes, pasos, tiempos)
- ✅ Marcar favoritos (requiere autenticación)
- ✅ Calificar recetas con un sistema de estrellas
- ✅ Cambiar entre modo claro y oscuro
- ✅ Contactar a través de un formulario
- ✅ Autenticación integrada con Clerk

El proyecto utiliza patrones modernos de React como Context API para state management y React Router v6 para navegación clientside.

## 🛠 Stack Tecnológico

### Frontend

- **React 19** - Librería UI con hooks y features modernas
- **Vite 5** - Build tool ultrarrápido (sustituye CRA con mejor DX)
- **React Router v6** - Enrutamiento SPA con lazy loading
- **Bootstrap 5** - Framework CSS responsive
- **React Icons** - Librería de iconos SVG (Font Awesome)
- **Framer Motion** - Animaciones declarativas y gestos
- **Context API** - State management descentralizado

### Autenticación & Validación

- **Clerk** - Autenticación moderna (OAuth, email/password)
- **Validadores customizados** - Utilidades para validación de formularios

### Desarrollo

- **ESLint** - Linting y code quality
- **Vite Config** - Optimización de assets y build

## 📦 Requisitos Previos

```bash
# Verifica que tengas instalados:
node --version  # v18.0.0 o superior
npm --version   # v9.0.0 o superior
```

## 🚀 Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/EzequielTorre/Cocina-Argentina.git
cd Cocina-Argentina

# 2. Instala dependencias
npm install

# 3. Crea archivo .env con las variables necesarias (ver sección Variables de Entorno)
cp .env.example .env.local

# 4. Inicia el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔧 Configuración

### Configuración de Vite

El proyecto utiliza `vite.config.js` para:

- Resolver módulos de React
- Optimizar assets estáticos
- Configurar dev server

### Configuración de Eslint

Basado en `eslint.config.js` para mantener code quality:

```bash
npm run lint
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia dev server con hot reload

# Build para producción
npm run build        # Genera bundle optimizado en /dist

# Preview de build local
npm run preview      # Ejecuta dist localmente

# Lint
npm run lint         # Verifica código con ESLint
```

## 📁 Estructura del Proyecto

```
cocina-argentina/
├── src/
│   ├── components/          # Componentes React reutilizables
│   │   ├── Header.jsx       # Navbar con tema light/dark
│   │   ├── Home.jsx         # Página principal
│   │   ├── RecipeList.jsx   # Listado con búsqueda
│   │   ├── RecipeCard.jsx   # Card individual de receta
│   │   ├── RecipeDetail.jsx # Vista detallada de receta
│   │   ├── Favorites.jsx    # Recetas marcadas como favoritos
│   │   ├── Contact.jsx      # Formulario de contacto
│   │   ├── Login.jsx        # Página de login (Clerk)
│   │   ├── Register.jsx     # Página de registro (Clerk)
│   │   ├── Footer.jsx       # Pie de página
│   │   ├── Carousel.jsx     # Carrusel de destacadas
│   │   ├── StarRating.jsx   # Sistema de calificación
│   │   └── data/
│   │       └── recipes.json # Base de datos de recetas (JSON)
│   ├── context/             # Context API providers
│   │   ├── FavoritesContext.jsx   # Manejo de favoritos
│   │   ├── RatingsContext.jsx     # Sistema de calificaciones
│   │   └── RecipeContext.jsx      # Estado global de recetas
│   ├── utils/
│   │   └── validators.js    # Funciones de validación
│   ├── assets/              # Imágenes y assets estáticos
│   ├── App.jsx              # Componente raíz
│   ├── App.css              # Estilos globales
│   └── main.jsx             # Entry point
├── public/                  # Assets públicos
│   ├── cutting-board.svg   # Favicon (tabla de cortar)
│   ├── knife.svg           # Icono personalizado
│   └── vite.svg
├── index.html              # Template HTML
├── vite.config.js          # Configuración de Vite
├── eslint.config.js        # Configuración de ESLint
├── package.json
├── .env                    # Variables de entorno
├── .gitignore
└── README.md               # Este archivo
```

## 🏗 Arquitectura

### State Management

```
App (Root)
├── Header (theme context)
├── Routes
│   ├── Home (RecipeContext, RatingsContext)
│   ├── RecipeList (RecipeContext, búsqueda local)
│   ├── RecipeDetail (RecipeContext, RatingsContext)
│   ├── Favorites (FavoritesContext, autenticado)
│   ├── Contact
│   └── Login/Register (Clerk)
└── Footer
```

**Contextos disponibles:**

- `RecipeContext` - Manejo de recetas y búsqueda
- `FavoritesContext` - Gestión de favoritos (persistencia localStorage)
- `RatingsContext` - Sistema de calificaciones (1-5 estrellas)

### Flujo de Datos

```
User Input → Component State/Context → Re-render → DOM Update
```

Lazy loading de rutas con React Router para optimizar bundle size.

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_CLERK_SECRET_KEY=sk_test_xxxxx

# Supabase (para favoritos y calificaciones)
VITE_SUPABASE_URL=https://xxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyxxxxxxx

# API Endpoints (opcional)
VITE_API_BASE_URL=https://api.example.com

# Environment
VITE_ENV=development
```

> **Nota:** la aplicación usa Supabase únicamente para almacenar favoritos y calificaciones. Si tu base de datos aún no tiene filas para todas las recetas locales, al iniciar la aplicación se insertarán automáticamente gracias al script `ensureRecipes`.

> Si deseas precargar tu tabla de recetas manualmente, puedes ejecutar un pequeño script de node o usar el panel SQL de Supabase para insertar los registros desde `src/components/data/recipes.json`. Asegúrate de que la tabla `recipes` tenga columnas compatibles (`id`, `title`, `description`, `category`, `image`, `time`, `difficulty`, `ingredients json` o `text[]`, `instructions text`).
>
> Nota: el código actual detecta y elimina automáticamente campos opcionales (`created_by`, `status`) si la tabla no los tiene, así que no es obligatorio añadirlos al esquema.

**Importante:** Todas las variables de Clerk y Supabase deben ir precedidas con `VITE_` para que Vite las inyecte en el bundle.

### 🔧 Corregir esquema de favoritos

Si al pulsar el corazón ves un error parecido a:

```
duplicate key value violates unique constraint "favorites_user_id_key"
```

significa que tu tabla `favorites` tiene una restricción única **solo** sobre `user_id`,
lo cual impide que un mismo usuario marque más de una receta. La aplicación espera
un índice compuesto `(user_id, recipe_id)`.

Puedes arreglarlo en el editor SQL de Supabase ejecutando:

```sql
alter table favorites drop constraint if exists favorites_user_id_key;
alter table favorites add constraint favorites_user_id_recipe_id_key
  unique (user_id, recipe_id);
```

una vez hecho esto, la inserción funcionará correctamente y se guardarán varios
favoritos por usuario. El cliente del frontend ya está preparado para ignorar el
error mientras no hagas la corrección, pero no podrá almacenar más de una
receta si la tabla permanece con la restricción incorrecta.

```**Importante:** Todas las variables de Clerk deben ir precedidas con `VITE\_` para que Vite las inyecte en el bundle.

Para obtener las claves de Clerk:

1. Ve a [clerk.com](https://clerk.com)
2. Crea una aplicación
3. Copia las claves desde el dashboard

## 🗺 Rutas

| Ruta          | Componente   | Protegida | Descripción                     |
| ------------- | ------------ | --------- | ------------------------------- |
| `/`           | Home         | No        | Landing page                    |
| `/recetas`    | RecipeList   | ✅        | Listado completo de recetas     |
| `/receta/:id` | RecipeDetail | ✅        | Detalle de una receta           |
| `/favoritos`  | Favorites    | ✅        | Recetas marcadas como favoritas |
| `/contacto`   | Contact      | No        | Formulario de contacto          |
| `/login`      | Login        | No        | Página de login (Clerk)         |
| `/registro`   | Register     | No        | Página de registro (Clerk)      |

Las rutas protegidas redirigen a login si el usuario no está autenticado.

## ⭐ Características Principales

### 1. **Autenticación con Clerk**

```jsx
<SignedIn>
  {/* Contenido protegido */}
</SignedIn>
<SignedOut>
  <RedirectToSignIn />
</SignedOut>
```

### 2. **Sistema de Favoritos (Persistente)**

```jsx
// Usando FavoritesContext
const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
```

### 3. **Tema Light/Dark**

```jsx
// Usando localStorage y Bootstrap 5 data attributes
[data-bs-theme="dark"] / [data-bs-theme="light"]
```

### 4. **Búsqueda y Filtrado**

```jsx
// Búsqueda en tiempo real en RecipeList
const filteredRecipes = recipes.filter((r) =>
  r.name.toLowerCase().includes(search.toLowerCase()),
);
```

### 5. **Sistema de Calificaciones**

```jsx
// StarRating component reutilizable
<StarRating recipeId={id} onRate={handleRate} />
```

## 🚀 Despliegue

### Despliegue en Vercel (Recomendado)

```bash
# 1. Push a GitHub (ya hecho)
git push origin main

# 2. Ve a vercel.com
# 3. Conecta tu repositorio GitHub
# 4. Vercel detectará automáticamente Vite
# 5. Añade variables de entorno (VITE_CLERK_PUBLISHABLE_KEY, etc)
# 6. Deploy automático en cada push a main
```

**Configuración Vercel:**

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Despliegue en Netlify

```bash
npm run build
# Luego sube la carpeta /dist a Netlify
```

### Despliegue en tu servidor

```bash
npm run build
# Copia la carpeta /dist a tu servidor
# Configura el servidor para servir index.html en rutas que no existan (SPA)
```

## 📝 Contribuciones

Las contribuciones son bienvenidas. Para cambios significativos:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit los cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 🤝 Soporte

¿Encontraste un bug? ¿Tienes una sugerencia?

- Abre un [Issue](https://github.com/EzequielTorre/Cocina-Argentina/issues)
- Contacta a través del formulario en la app

## 👨‍💻 Autor

**Ezequiel Torres**

- GitHub: [@EzequielTorre](https://github.com/EzequielTorre)
- Email: ezequiel.torres0682@gmail.com

---

**Última actualización:** Febrero 2026
