/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_DOMAIN_AUTH0: string;
  readonly VITE_CLIENT_ID_AUTH0: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
