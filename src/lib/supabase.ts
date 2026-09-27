import { createClient } from '@supabase/supabase-js';

// Supabase configuration for Government ITI College Jewargi
export const SUPABASE_PROJECT_ID = 'humbckobaficvgtkohjp';
export const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

export const SUPABASE_ANON_KEY = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
  'sb_publishable_Oe7eqi54mz8oeDFHnH8TGA_dpAmpeBQ';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Checks connection health to Supabase
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  tableExists: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id')
      .limit(1);

    if (error) {
      // Check if table missing (error code 42P01 in postgres or PostgREST PGRST205)
      if (
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        error.message?.includes('does not exist') ||
        error.message?.includes('Could not find the table') ||
        error.message?.includes('relation "appointments" does not exist')
      ) {
        return {
          connected: true,
          tableExists: false,
          error: 'Connected to Supabase project, but table "appointments" has not been created yet in the SQL Editor.',
        };
      }
      return { connected: false, tableExists: false, error: error.message };
    }
    return { connected: true, tableExists: true };
  } catch (err: any) {
    return { connected: false, tableExists: false, error: err?.message || 'Network error' };
  }
}
