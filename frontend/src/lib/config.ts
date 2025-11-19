const REQUIRED_API_BASE = import.meta.env.PUBLIC_API_BASE;

if (!REQUIRED_API_BASE) {
  throw new Error('PUBLIC_API_BASE no está configurado. Define la variable en tu entorno (.env).');
}

export const API_BASE = REQUIRED_API_BASE;
export const STATIC_API_TOKEN = import.meta.env.PUBLIC_API_TOKEN || '';
