# 🍲 Cocina Argentina - Plataforma de Comunidad Gastronómica Fullstack

> Una solución robusta y escalable diseñada para transformar la experiencia culinaria en una red social interactiva. Este proyecto representa la evolución de un recetario estático hacia una plataforma profesional con persistencia de datos, gestión de medios en la nube y administración de contenidos en tiempo real.

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?logo=supabase)](https://supabase.com)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)](https://clerk.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vitejs.dev)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap)](https://getbootstrap.com)

## �️ Arquitectura y Stack Técnico

Como desarrollador, he priorizado una arquitectura desacoplada y moderna utilizando **BaaS (Backend as a Service)** para garantizar velocidad de respuesta y seguridad:

- **Frontend React 19**: Implementación de Hooks avanzados y `Context API` para la gestión de estados globales (Notificaciones, Recetas, Autenticación).
- **Persistencia con PostgreSQL (Supabase)**: Modelado de datos relacional para usuarios, recetas, comentarios, favoritos y ratings.
- **Gestión de Medios (Cloud Storage)**: Integración nativa con Supabase Buckets para la carga, procesamiento y entrega de imágenes de recetas y avatares de usuario.
- **Autenticación Middleware (Clerk)**: Control de sesiones seguro con soporte para perfiles sociales y protección de rutas privadas.
- **Real-time WebSockets**: Implementación de `Postgres Changes` para notificaciones instantáneas sin necesidad de recargar la página.

## 🚀 Implementaciones de Ingeniería

### 🛡️ Panel de Administración y Moderación

He desarrollado un **Admin Dashboard** protegido que permite una gestión integral del ecosistema:

- **Moderación Global**: Capacidad de auditar y eliminar comentarios en toda la plataforma.
- **Curaduría de Contenido**: Herramienta para destacar recetas ("Featured") que impactan dinámicamente en la landing page.
- **Control de Inventario**: Gestión completa del CRUD de recetas desde una interfaz centralizada.

### � SEO y Optimización

- **Dynamic Meta Tags**: Uso de `react-helmet-async` para generar Open Graph y Twitter Cards dinámicos, permitiendo que cada receta se comparta de forma profesional en redes sociales.
- **Code Splitting**: Optimización de chunks para mejorar el tiempo de carga inicial (LCP).
- **Responsive Premium**: Diseño adaptativo con Bootstrap 5 y CSS Custom Properties para una experiencia consistente en dispositivos móviles y escritorio.

### � Seguridad y RLS

- **Row Level Security (RLS)**: Implementación de políticas SQL a nivel de base de datos para asegurar que cada usuario solo pueda modificar sus propios datos y archivos en el Storage.
- **Environment Security**: Gestión estricta de variables de entorno para proteger credenciales sensibles de servicios externos.

## 📂 Estructura del Ecosistema

```text
src/
├── components/          # Componentes de interfaz (Dashboard, Perfiles, SEO, Notificaciones)
├── context/             # Capas de estado global (NotificationContext, RecipeContext)
├── services/            # Clientes de API y lógica de persistencia (Supabase, Email Service)
├── utils/               # Validadores de esquemas y formateadores de datos
├── App.jsx              # Orquestador de rutas y protección de vistas
└── main.jsx             # Punto de entrada con inyección de Providers
```

## ⚙️ Requisitos del Entorno

Para replicar el entorno de desarrollo, se requiere configurar las siguientes variables en un archivo `.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=...
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
# Credenciales de servicio de correo (EmailJS)
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

## � Despliegue e Instalación

1. Clona el repositorio: `git clone https://github.com/EzequielTorre/Cocina-Argentina.git`
2. Instala las dependencias: `npm install`
3. Ejecuta el servidor de desarrollo: `npm run dev`
4. Build para producción: `npm run build`

---

📩 **Contacto**: ezequiel.torres0682@gmail.com 🎓 **Estudiante de programación de la academia Talento Tech**
