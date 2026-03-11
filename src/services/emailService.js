import emailjs from "@emailjs/browser";

/**
 * Servicio centralizado para el envío de correos electrónicos
 */

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Envía un correo electrónico usando EmailJS
 * @param {Object} templateParams - Parámetros definidos en la plantilla de EmailJS
 * @returns {Promise}
 */
export const sendEmail = async (templateParams) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn("EmailJS no está configurado en las variables de entorno.");
    return Promise.reject("Faltan credenciales de EmailJS");
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY,
    );
    return response;
  } catch (error) {
    console.error("Error al enviar email:", error);
    throw error;
  }
};

/**
 * Envía una alerta de notificación al administrador (Ezequiel)
 * @param {string} type - Tipo de alerta ('comment', 'new_recipe', etc.)
 * @param {Object} data - Datos adicionales
 */
export const sendAdminAlert = async (type, data) => {
  const adminEmail = "ezequiel.torres0682@gmail.com";

  const templateParams = {
    to_email: adminEmail,
    subject: `Nueva alerta en Cocina Argentina: ${type}`,
    message: typeof data === "object" ? JSON.stringify(data, null, 2) : data,
    from_name: data.from_name || "Sistema de Notificaciones",
    ...data,
  };

  return sendEmail(templateParams);
};

/**
 * Envía un correo desde el formulario de contacto al administrador
 * @param {Object} contactData - Datos del formulario {name, email, message}
 */
export const sendContactEmail = async (contactData) => {
  const adminEmail = "ezequiel.torres0682@gmail.com";

  const templateParams = {
    to_email: adminEmail,
    from_name: contactData.name,
    from_email: contactData.email,
    message: contactData.message,
    subject: `Nuevo mensaje de contacto de ${contactData.name}`,
    reply_to: contactData.email,
  };

  return sendEmail(templateParams);
};
