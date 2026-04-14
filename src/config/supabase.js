// src/config/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lkipfoljkgvrdmlxvloj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxraXBmb2xqa2d2cmRtbHh2bG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzE3NTcsImV4cCI6MjA5MTc0Nzc1N30.e_YooeWWE0eA6uTpn5eXoheRqUVPMGfucFEqfbwXgvg";

export const supabase = createClient(supabaseUrl, supabaseKey);