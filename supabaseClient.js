import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database

const supabaseUrl = 'https://xfwoqosuqasyuviaxaot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmd29xb3N1cWFzeXV2aWF4YW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzOTk0NjQsImV4cCI6MjA0OTk3NTQ2NH0.S1cBM4ERmnRMTzj1HPJZOXzegqDkiiTdqr8OXXAvZC8';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;