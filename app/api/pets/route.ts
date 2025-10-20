import { PetService } from "@/services/pet_service"

export async function GET() {
    const pet_service = new PetService()
    const pets = await pet_service.getPets()
    return new Response(JSON.stringify(pets), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}