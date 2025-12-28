import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/config/supabase.server"
import { PetService } from "@/services/pet_service"

export async function DELETE(
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

    // ✅ 下架：真正刪除寵物資料
    const petService = new PetService()
    await petService.deletePet(pet_id)

    return NextResponse.json({ ok: true, message: "寵物已成功下架" }, { status: 200 })
  } catch (error) {
    console.error("DELETE /api/pets/[pet_id]/unpublish error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
