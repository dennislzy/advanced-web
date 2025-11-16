import { AdoptService } from "@/services/adopt_dervice";
import { PetService } from "@/services/pet_service";
import { createSupabaseServerClient } from '@/config/supabase.server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ user_account: string }> }  // 改成 Promise
) {
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

        const { user_account } = await params;  // 加上 await

        if (!user_account) {
            return new Response(JSON.stringify({ error: 'user_account is required' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const adopt_service = new AdoptService();
        const adopt_records = await adopt_service.getAdoptApplicationsByUser(user_account)

        return new Response(JSON.stringify(adopt_records), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}