/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_ENDPOINT?: string;
  readonly VITE_ADMIN_PIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
