// lib/supabase.server.ts - 服务器端专用
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// 服务器端使用 (在 API routes 中) - 繞過 RLS
export const supabaseAdmin = supabaseServiceRoleKey
  ? createBrowserClient(supabaseUrl, supabaseServiceRoleKey)
  : createBrowserClient(supabaseUrl, supabaseAnonKey)

// 創建帶有用戶 session 的 server client
export function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
