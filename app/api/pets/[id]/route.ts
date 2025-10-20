import { PetService } from "@/services/pet_service"
import { NextRequest } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const pet_service = new PetService()
        const pet = await pet_service.getPetById(id)

        if (!pet) {
            return new Response(JSON.stringify({ error: 'Pet not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }

        return new Response(JSON.stringify(pet), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error fetching pet:', error)
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'Internal server error'
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }
}
