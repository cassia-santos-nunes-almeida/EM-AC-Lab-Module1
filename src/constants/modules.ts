export const MODULE_URLS = {
  module1: import.meta.env.VITE_MODULE1_URL as string ?? '/',
  module2: import.meta.env.VITE_MODULE2_URL as string ?? '/',
  module3: import.meta.env.VITE_MODULE3_URL as string ?? '/',
} as const;
