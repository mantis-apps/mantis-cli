/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly FRONTEND_URLS?: string;
  readonly MONGODB_URI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
