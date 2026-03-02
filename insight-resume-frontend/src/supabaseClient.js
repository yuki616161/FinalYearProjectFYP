import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldhnhhgiuqpzvjrwfxwo.supabase.co';
const supabaseAnonKey = 'sb_publishable_3ShrON3KfXCNdBetAdrEAg_kYZKM0PL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);