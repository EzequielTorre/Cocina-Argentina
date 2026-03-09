# 🍲 Cocina Argentina - Plataforma de Comunidad Gastronómica Premium

> Una experiencia web social y profesional diseñada para explorar, crear y compartir el legado culinario argentino. Desarrollada con un stack de última generación enfocado en la interacción en tiempo real y la gestión avanzada de medios.

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?logo=supabase)](https://supabase.com)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)](https://clerk.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap)](https://getbootstrap.com)

## 🚀 Características Principales

### ��🇷 Comunidad y Red Social

- **Perfiles Premium**: Páginas de perfil rediseñadas con banner hero, biografía, ocupación, medallas de logros y enlaces a redes sociales (Instagram, X, Facebook).
- **Interacción en Tiempo Real**: Sistema de notificaciones mediante WebSockets que alerta instantáneamente sobre nuevos comentarios y calificaciones.
- **Comunidad Gastronómica**: Sistema de comentarios dinámico con atribución de autor y enlaces directos entre perfiles.
- **Atribución Dinámica**: Cada receta está vinculada a su creador, fomentando el reconocimiento entre cocineros.

### 🛠️ Herramientas Avanzadas

- **Supabase Storage**: Gestión real de archivos multimedia. Los usuarios pueden subir sus propias fotos de recetas y avatares directamente a la nube.
- **Modo Cocina Pro**: Interfaz optimizada con prevención de bloqueo de pantalla (Wake Lock API) para seguir instrucciones sin interrupciones.
- **Buscador Inteligente**: Filtros avanzados por ingredientes, categorías y niveles de dificultad con contador dinámico de resultados.
- **Home Dinámica**: Secciones inteligentes de "Receta del Día", "Mejores Postres" y "Últimas Incorporaciones".

### 💾 Ingeniería y Persistencia

- **Sincronización Cloud**: Persistencia total de favoritos, calificaciones y comentarios mediante Supabase.
- **Arquitectura de Estado**: Uso intensivo de React Context API para una gestión fluida de notificaciones, recetas y autenticación.
- **Seguridad RLS**: Políticas de Row Level Security configuradas para proteger los datos y archivos de cada usuario.

## 🛠️ Stack Tecnológico

- **Frontend**: React 19, Vite, React Router v6, Bootstrap 5 (Custom CSS), React Icons.
- **BaaS (Backend as a Service)**:
  - **Supabase**: Base de datos PostgreSQL, Realtime (WebSockets) y Storage (Buckets).
- **Autenticación**: Clerk (Gestión de usuarios y sesiones).
- **APIs Modernas**: Web Wake Lock API, Fetch API, URL Object API.

## 📂 Estructura del Proyecto

```text
src/
├── components/          # Interfaz de usuario (Home, Perfiles, Notificaciones)
│   ├── ui/              # Componentes atómicos (Skeletons, Spinners, Alerts)
│   └── data/            # Fallback de datos locales
├── context/             # Lógica global (Notifications, Recipes, Favorites, Ratings)
├── services/            # Cliente Supabase y lógica de subida de medios
├── App.jsx              # Enrutamiento y layouts
└── main.jsx             # Inyección de Providers globales
```

## ⚙️ Configuración del Entorno

Requiere un archivo `.env` con las siguientes claves:

```env
VITE_CLERK_PUBLISHABLE_KEY=tu_key_de_clerk
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_key_anonima_de_supabase
VITE_EMAILJS_SERVICE_ID=tu_service_id_de_emailjs
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_de_emailjs
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_de_emailjs
```

## 📧 Configuración de EmailJS

Para recibir los mensajes del formulario de contacto y las alertas de actividad en tu correo personal:

1. Crea una cuenta en [EmailJS](https://www.emailjs.com/).
2. Conecta tu servicio de Gmail.
3. Crea una plantilla que incluya los campos: `from_name`, `from_email`, `message`, `recipe_title` y `comment_content`.
4. Copia las credenciales en tu archivo `.env`.

## 📖 Instalación

1. Clona el repositorio: `git clone https://github.com/EzequielTorre/Cocina-Argentina.git`
2. Instala las dependencias: `npm install`
3. Inicia el modo desarrollo: `npm run dev`

---

📩 **Contacto**: ezequiel.torres0682@gmail.com
🎓 **Estudiante de programación de la academia Talento Tech**
