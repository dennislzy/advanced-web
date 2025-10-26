import { createClient } from "@/config/server"
import { CreatePetDto, Pet, UpdatePetDto } from "@/model/petModel"
import { BaseService } from "./base/base_service"

export class PetService extends BaseService {
    // 新增寵物
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

    // 取得寵物列表，支援依品種篩選
    async getPets(variety?: string): Promise<Pet[]> {
        const supabase = await this.createClient()

        // 先建立查詢物件
        let query = supabase.from('pet').select('*')

        if (variety) {
            query = query.eq('variety', variety)
        }

        // 執行查詢
        const { data: pets, error } = await query

        if (error) {
            throw new Error(error.message)
        }

        return pets || []
    }
    // 透過 ID 取得單一寵物資訊
    async getPetById(id: string): Promise<Pet | null> {
        const supabase = await this.createClient()
        const { data: pet, error } = await supabase
            .from('pet')
            .select('*')
            .eq('pet_id', id)
            .single()

        if (error) {
            throw new Error(error.message)
        }

        return pet
    }
    // 更新寵物資訊
    async updatePet(id: string, data: Partial<UpdatePetDto>): Promise<Pet> {
        const supabase = await this.createClient()
        const { data: pet, error } = await supabase
            .from('pet')
            .update(data)
            .eq('pet_id', id)
            .select()
            .single()

        if (error) {
            throw new Error(error.message)
        }

        return pet
    }
}