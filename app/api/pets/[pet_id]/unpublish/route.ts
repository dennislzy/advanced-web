import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/config/supabase.server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ pet_id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient()

    // ✅ 跟上架一致：必須登入
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "未授權：請先登入" }, { status: 401 })
    }

    const { pet_id } = await params

    // ✅ 下架：改 adopt_status 為 "否"
    const { data, error } = await supabase
      .from("pet")
      .update({ adopt_status: "否" })
      .eq("pet_id", pet_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message, detail: error },
        { status: 400 }
      )
    }

    return NextResponse.json({ ok: true, pet: data }, { status: 200 })
  } catch (error) {
    console.error("PATCH /api/pets/[pet_id]/unpublish error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
