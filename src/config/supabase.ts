import { createClient } from '@supabase/supabase-js';

import { secrets } from './secrets';

const supabaseClient = createClient(
  secrets.supabase.publicURL,
  secrets.supabase.publicKey,
);

export default supabaseClient;
