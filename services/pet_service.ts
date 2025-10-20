import { createClient } from "@/config/server"
import { CreatePetDto, Pet } from "@/model/petModel"
import { BaseService } from "./base/base_service"

export class PetService extends BaseService {
    async createPet(data: CreatePetDto): Promise<Pet> {
        const supabase = await this.createClient()
        const { data: pet, error } = await supabase
            .from('pet')
            .insert(data)
            .select()
            .single()

        if (error) {
            throw new Error(error.message)
        }

        if (!pet) {
            throw new Error('Failed to create pet')
        }

        return pet
    }

    async getPets(): Promise<Pet[]> {
        const supabase = await this.createClient()
        const { data: pets, error } = await supabase
            .from('pet')
            .select('*')

        if (error) {
            throw new Error(error.message)
        }

        return pets || []
    }

    async getPetById(id: string): Promise<Pet | null> {
        const supabase = await this.createClient()
        const { data: pet, error } = await supabase
            .from('pet')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            throw new Error(error.message)
        }

        return pet
    }
}