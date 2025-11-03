import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// ✅ 取得所有顧客
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// ✅ 新增顧客 (Create)
export async function POST(req: Request) {
  try {
    const { name, gender } = await req.json()

    if (!name || !gender)
      return NextResponse.json({ error: '缺少必要欄位 name 或 gender' }, { status: 400 })

    const { data, error } = await supabase
      .from('customers')
      .insert([{ name, gender }])
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// ✅ 更新顧客 (Update)
export async function PUT(req: Request) {
  try {
    const { id, name, gender } = await req.json()

    if (!id)
      return NextResponse.json({ error: '缺少 id' }, { status: 400 })

    type UpdateCustomerData = {
      name?: string
      gender?: string
    }
    const updateData: UpdateCustomerData = {}
    if (name) updateData.name = name
    if (gender) updateData.gender = gender

    const { data, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// ✅ 刪除顧客 (Delete)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    if (!id)
      return NextResponse.json({ error: '缺少 id' }, { status: 400 })

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: '刪除成功' }, { status: 200 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
