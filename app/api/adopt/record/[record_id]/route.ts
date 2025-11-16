import { AdoptService } from "@/services/adopt_dervice";
import { createSupabaseServerClient } from '@/config/supabase.server'
import { NextResponse } from 'next/server'

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ record_id: string }> }  // 改成 Promise
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

        const { record_id } = await params;  // 加上 await

        if (!record_id) {
            return new Response(JSON.stringify({ error: 'record_id is required' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const recordIdNum = parseInt(record_id, 10);

        if (isNaN(recordIdNum)) {
            return new Response(JSON.stringify({ error: 'Invalid record_id' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const adopt_service = new AdoptService();
        await adopt_service.deleteAdoptApplication(recordIdNum);

        return new Response(null, {
            status: 204,
        });
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

