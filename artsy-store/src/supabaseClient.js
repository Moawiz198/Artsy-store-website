import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://unhckzvxonrshvxtuvpv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuaGNrenZ4b25yc2h2eHR1dnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM0ODczMjcsImV4cCI6MjAyOTA2MzMyN30.8V9n0mXkZ_6E8K_9Fp8Xv8C9Q3q6V4X5X2_Z5X7Y9k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
