import { AdoptService } from "@/services/adopt_dervice";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ record_id: string }> }  // 改成 Promise
) {
    const { record_id } = await params;  // 加上 await

    if (!record_id) {
        return new Response(JSON.stringify({ error: 'record_id is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
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
        return new Response(JSON.stringify({ error: 'Failed to delete application' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}