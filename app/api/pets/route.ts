import { PetService } from "@/services/pet_service"
import { createSupabaseServerClient } from '@/config/supabase.server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
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

        const { searchParams } = new URL(request.url)
        const variety = searchParams.get('variety')

        const pet_service = new PetService()
        const pets = await pet_service.getPets(variety || undefined)

        return new Response(JSON.stringify(pets), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}