import { PetService } from "@/services/pet_service"
import { createSupabaseServerClient } from "@/config/supabase.server"
import { NextResponse } from "next/server"

/**
 * 取得寵物列表（GET /api/pet）
 * 需要登入
 */
export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    // ✅ 檢查用戶是否已登入
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "未授權：請先登入" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const variety = searchParams.get("variety")

    const pet_service = new PetService()
    const pets = await pet_service.getPets(variety || undefined)

    return NextResponse.json(pets, { status: 200 })
  } catch (error) {
    console.error("GET /api/pet error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

/**
 * 新增寵物（POST /api/pet）
 * 需要登入
 */
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    // ✅ 檢查用戶是否已登入
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "未授權：請先登入" },
        { status: 401 }
      )
    }

    // ✅ 取得前端送來的資料
    const body = await request.json()

    // ⚠️ 建議：由後端強制補 user_id，避免前端亂塞
    const payload = {
      ...body,
    }

    const { data, error } = await supabase
      .from("pet")
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error("POST /api/pet DB insert error:", error)
      return NextResponse.json(
        { error: error.message, detail: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { ok: true, pet: data },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST /api/pet server error:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        detail: String((error as Error)?.message ?? error),
      },
      { status: 500 }
    )
  }
}
