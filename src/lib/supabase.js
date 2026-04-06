import { createClient } from '@supabase/supabase-js'
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_ANON_KEY

const supabaseUrl = VITE_SUPABASE_URL
const supabaseKey = VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)