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

    const { pet_id } = await request.json()

    // ✅ 驗證必要欄位
    if (!pet_id) {
      return NextResponse.json(
        { error: '缺少寵物 ID' },
        { status: 400 }
      )
    }

    // ✅ 驗證 pet_id 格式（應該是 UUID）
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(pet_id)) {
      return NextResponse.json(
        { error: '寵物 ID 格式錯誤' },
        { status: 400 }
      )
    }

    // ✅ 檢查寵物是否存在
    const { data: pet, error: petError } = await supabase
      .from('pet')
      .select('pet_id')
      .eq('pet_id', pet_id)
      .single()

    if (petError || !pet) {
      return NextResponse.json(
        { error: '寵物不存在' },
        { status: 404 }
      )
    }

    // ✅ 檢查是否已經申請過
    const { data: existingRecord } = await supabase
      .from('adopt_record')
      .select('record_id')
      .eq('user_account', user.id)
      .eq('pet_id', pet_id)
      .maybeSingle()

    if (existingRecord) {
      return NextResponse.json(
        { error: '您已經申請過此寵物的領養' },
        { status: 409 }
      )
    }

    // ✅ 建立領養申請 - 只插入資料表存在的欄位
    const { data: application, error } = await supabase
      .from('adopt_record')
      .insert([{
        user_account: user.id,  // UUID from auth
        pet_id: pet_id          // UUID from request
        // created_at 會自動使用 now()
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

    // ✅ 自動更新寵物的領養狀態為「是」（已被領養）
    const { error: updateError } = await supabase
      .from('pet')
      .update({ adopt_status: '是' })
      .eq('pet_id', pet_id)

    if (updateError) {
      console.error('Error updating pet status:', updateError)
      // 即使更新失敗，領養記錄已建立，仍返回成功
      // 可以考慮記錄警告日誌
    }

    return NextResponse.json({
      message: '領養申請已送出',
      data: application
    }, { status: 201 })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// ✅ 可選：取得用戶的領養記錄
export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '未授權：請先登入' },
        { status: 401 }
      )
    }

    const { data: records, error } = await supabase
      .from('adopt_record')
      .select(`
        record_id,
        created_at,
        pet:pet_id (
          pet_id,
          name,
          species,
          breed
        )
      `)
      .eq('user_account', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: records })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}