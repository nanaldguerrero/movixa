import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lkglenkhvimjzkmipeci.supabase.co'
const supabaseAnonKey = 'sb_publishable_HgWRZNQylPJfbjjKjHDwBg_-16anCw4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
