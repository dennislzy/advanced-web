// app/api/adopt/route.ts
import { createSupabaseServerClient } from '@/config/supabase.server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // ✅ 檢查用戶是否已登入
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '未授權：請先登入' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // ✅ 驗證必要欄位（根據你的需求調整）
    if (!data.pet_id || !data.applicant_name || !data.contact_info) {
      return NextResponse.json(
        { error: '缺少必要欄位' },
        { status: 400 }
      )
    }

    // ✅ 建立領養申請
    const { data: application, error } = await supabase
      .from('adopt_applications')
      .insert([{ 
        ...data,
        user_id: user.id,
        status: 'pending' // 預設狀態
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: application }, { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}