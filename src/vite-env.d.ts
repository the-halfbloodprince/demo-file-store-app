/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_ACCESS_KEY: string;
  readonly VITE_AWS_SECRET_KEY: string;
  readonly VITE_AWS_BUCKET_NAME: string;
  readonly VITE_AWS_SESSION_TOKEN: string;
}
