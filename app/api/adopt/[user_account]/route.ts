import { AdoptService } from "@/services/adopt_dervice";
import { PetService } from "@/services/pet_service";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ user_account: string }> }  // 改成 Promise
) {
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
}