// lib/supabase.client.ts - 客户端专用
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 客户端使用 (在瀏覽器中)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
