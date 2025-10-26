import { AdoptService } from "@/services/adopt_dervice";

export async function POST(request: Request) {
    const adopt_service = new AdoptService();
    const data = await request.json();
    const application = await adopt_service.createAdoptApplication(data);
    return new Response(JSON.stringify(application), {
        status: 201,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
