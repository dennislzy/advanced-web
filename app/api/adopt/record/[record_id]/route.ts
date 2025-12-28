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

        // ✅ 先獲取領養記錄以取得 pet_id
        const { data: adoptRecord, error: fetchError } = await supabase
            .from('adopt_record')
            .select('pet_id')
            .eq('record_id', recordIdNum)
            .eq('user_account', user.id)  // 確保只能刪除自己的領養記錄
            .single()

        if (fetchError || !adoptRecord) {
            return NextResponse.json(
                { error: '找不到該領養記錄或您無權刪除' },
                { status: 404 }
            )
        }

        const adopt_service = new AdoptService();
        await adopt_service.deleteAdoptApplication(recordIdNum);

        // ✅ 自動更新寵物的領養狀態為「否」（可領養）
        const { error: updateError } = await supabase
            .from('pet')
            .update({ adopt_status: '否' })
            .eq('pet_id', adoptRecord.pet_id)

        if (updateError) {
            console.error('Error updating pet status:', updateError)
            // 即使更新失敗，領養記錄已刪除，仍返回成功
        }

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

