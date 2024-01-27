const config = {
  supabase: {
    publicURL: import.meta.env.VITE_SUPABASE_PROJECT_URL,
    publicKey: import.meta.env.VITE_SUPABASE_PUBLIC_KEY,
  },
  aws: {
    accessKeyID: import.meta.env.VITE_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
    sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
    bucketName: import.meta.env.VITE_AWS_BUCKET_NAME,
    region: import.meta.env.VITE_AWS_REGION,
  },
};

export default config;
