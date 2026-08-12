import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xugtzkjougqpnryvvylk.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QAtI_fP9xA9IhNYQeNRTwg_yW-cjRmJ';

export const supabase = createClient(supabaseUrl, supabaseKey);
