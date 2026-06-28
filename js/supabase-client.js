import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://akkotzmreadksrcuykhs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFra290em1yZWFka3NyY3V5a2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MjgyODQsImV4cCI6MjA5ODIwNDI4NH0.dO7MS9CbiSTOYDkvd9ossFCEMHVKb5qldK2SO-K3gqo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
