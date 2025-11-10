import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id  // 從動態路由參數取得 id
    const { name, price } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: '缺少產品 ID' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('products')
      .update({ name, price })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: data[0] }, { status: 200 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id  // 從動態路由參數取得 id

    if (!id) {
      return NextResponse.json(
        { error: '缺少產品 ID' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}