import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://cykqlsbjqlhiqemkbuhy.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_u01tEZxEmXqMXJ8v2Yff3Q_LNXc0v9t';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  DEFAULT_ANON_KEY;

export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey);
