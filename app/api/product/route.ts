// app/api/product/route.ts
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function GET() {
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

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

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

    const { name, price } = await request.json()

    if (!name || !price) {
      return NextResponse.json(
        { error: '缺少必要欄位：name 和 price' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name,
        price
      }])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: data[0] }, { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}