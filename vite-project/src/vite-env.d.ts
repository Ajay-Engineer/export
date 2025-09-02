/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    emailjs: {
      send: (serviceId: string, templateId: string, data: any, publicKey: string) => Promise<any>;
    };
  }
}
