import { PetService } from "@/services/pet_service"
import { UpdatePetDto } from "@/model/petModel"
import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from '@/config/supabase.server'

/**
 * 取得單一寵物
 * - 不需要登入（因為你前台是公開瀏覽）
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { pet_id: string } }
) {
    try {
        const { pet_id } = params

        const pet_service = new PetService()
        const pet = await pet_service.getPetById(pet_id)

        if (!pet) {
            return NextResponse.json({ error: "Pet not found" }, { status: 404 })
        }

        return NextResponse.json(pet, { status: 200 })
    } catch (error) {
        console.error("Error fetching pet:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

/**
 * 更新寵物資訊（需要登入）
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { pet_id: string } }
) {
    try {
        const supabase = await createSupabaseServerClient()

        // 檢查登入
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: "未授權：請先登入" },
                { status: 401 }
            )
        }

        const { pet_id } = params
        const body: Partial<UpdatePetDto> = await request.json()

        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json(
                { error: "Request body cannot be empty" },
                { status: 400 }
            )
        }

        const pet_service = new PetService()

        // 檢查寵物是否存在
        const existingPet = await pet_service.getPetById(pet_id)
        if (!existingPet) {
            return NextResponse.json(
                { error: "Pet not found" },
                { status: 404 }
            )
        }

        // 更新寵物
        const updatedPet = await pet_service.updatePet(pet_id, body)

        return NextResponse.json(updatedPet, { status: 200 })
    } catch (error) {
        console.error("Error updating pet:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
