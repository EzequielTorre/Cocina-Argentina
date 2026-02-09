/**
 * Archivo de validaciones reutilizables
 * Importa estas funciones en cualquier componente que las necesite
 */

/**
 * Valida si un email es válido
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido, false si no
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Valida si un nombre es válido
 * @param {string} name - Nombre a validar
 * @param {number} minLength - Longitud mínima (default: 3)
 * @param {number} maxLength - Longitud máxima (default: 50)
 * @returns {boolean} true si es válido, false si no
 */
export const isValidName = (name, minLength = 3, maxLength = 50) => {
  const trimmedName = name.trim();
  return trimmedName.length >= minLength && trimmedName.length <= maxLength;
};

/**
 * Valida si un mensaje es válido
 * @param {string} message - Mensaje a validar
 * @param {number} minLength - Longitud mínima (default: 10)
 * @param {number} maxLength - Longitud máxima (default: 500)
 * @returns {boolean} true si es válido, false si no
 */
export const isValidMessage = (message, minLength = 10, maxLength = 500) => {
  const trimmedMessage = message.trim();
  return (
    trimmedMessage.length >= minLength && trimmedMessage.length <= maxLength
  );
};

/**
 * Valida si un ID es un número válido
 * @param {string|number} id - ID a validar
 * @returns {boolean} true si es válido, false si no
 */
export const isValidId = (id) => {
  const numId = parseInt(id);
  return !isNaN(numId) && numId > 0;
};

/**
 * Genera un objeto de error para un campo
 * @param {string} field - Nombre del campo
 * @param {string} message - Mensaje de error
 * @returns {Object} Objeto con el error
 */
export const createFieldError = (field, message) => {
  return {
    [field]: message,
  };
};

/**
 * Obtiene mensajes de error generalizados
 */
export const errorMessages = {
  name: {
    required: "El nombre es requerido",
    tooShort: "El nombre debe tener al menos 3 caracteres",
    tooLong: "El nombre no puede exceder 50 caracteres",
  },
  email: {
    required: "El email es requerido",
    invalid: "Por favor ingresa un email válido",
  },
  message: {
    required: "El mensaje es requerido",
    tooShort: "El mensaje debe tener al menos 10 caracteres",
    tooLong: "El mensaje no puede exceder 500 caracteres",
  },
  recipeId: {
    invalid: "El ID de la receta no es válido",
  },
};
