import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ecjnhzqslyuvjdhcqiwg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjam5oenFzbHl1dmpkaGNxaXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNTQ0MTEsImV4cCI6MjA5MjYzMDQxMX0.F-yZw5lMqUaaPoh240f7YbtLTfwcPmVaS_YTtpilL_4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
