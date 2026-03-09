import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Componente para gestionar el SEO de forma centralizada
 * @param {string} title - Título de la página
 * @param {string} description - Descripción para buscadores
 * @param {string} image - URL de la imagen para redes sociales
 * @param {string} url - URL actual de la página
 * @param {string} type - Tipo de contenido (website, article, etc.)
 */
const SEO = ({ title, description, image, url, type = 'website' }) => {
  const siteName = 'Cocina Argentina';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'Explora y comparte las mejores recetas de la cocina tradicional argentina.';
  const defaultImage = 'https://ygcygxbtnmwirejddvdk.supabase.co/storage/v1/object/public/recipe-images/hero-home.jpg'; // Imagen por defecto
  
  return (
    <Helmet>
      {/* Meta tags estándar */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      
      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || window.location.href} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

export default SEO;
