import { PetService } from "@/services/pet_service"
import { UpdatePetDto } from "@/model/petModel"
import { NextRequest } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ pet_id: string }> }
) {
    try {
        const { pet_id } = await params
        const pet_service = new PetService()
        const pet = await pet_service.getPetById(pet_id)

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

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ pet_id: string }> }
) {
    try {
        const { pet_id } = await params
        const body: Partial<UpdatePetDto> = await request.json()

        // 驗證請求體不為空
        if (!body || Object.keys(body).length === 0) {
            return new Response(
                JSON.stringify({ error: 'Request body cannot be empty' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        }

        const pet_service = new PetService()

        // 先檢查寵物是否存在
        const existingPet = await pet_service.getPetById(pet_id)
        if (!existingPet) {
            return new Response(JSON.stringify({ error: 'Pet not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }

        // 更新寵物資訊
        const updatedPet = await pet_service.updatePet(pet_id, body)

        return new Response(JSON.stringify(updatedPet), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error updating pet:', error)
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
