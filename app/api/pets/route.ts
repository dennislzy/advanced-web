import { PetService } from "@/services/pet_service"

export async function GET(request: Request) {
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
}