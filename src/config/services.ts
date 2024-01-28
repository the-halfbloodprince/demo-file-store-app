import s3Client from './s3';
import supabaseClient from './supabase';

export const services = {
  supabase: supabaseClient,
  s3: s3Client,
};
