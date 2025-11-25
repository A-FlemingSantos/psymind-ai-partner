export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  WORKSPACE: '/workspace',
  CALENDAR: '/calendar',
  EDITOR: '/editor',
} as const;

export const API_ENDPOINTS = {
  GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
} as const;