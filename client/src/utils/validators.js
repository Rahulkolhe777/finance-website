export const isRequired = (value) => String(value ?? '').trim().length > 0;
export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
export const isPhone = (value) => /^[6-9]\d{9}$/.test(String(value).replace(/\D/g, '').slice(-10));
