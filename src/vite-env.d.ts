/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOSM_API_URL: string;
  readonly VITE_LOSM_WS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
