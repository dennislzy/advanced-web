
export interface Pet {
  pet_id: string
  pet_name: string
  pet_image: string | null
  gender: string
  variety: string
  shelter_name: string
  introduction: string | null
  created_at: string
  updated_at: string
  adopt_status: string
}

export interface CreatePetDto {
  pet_name: string
  pet_image?: string
  gender: string
  variety: string
  shelter_name: string
  introduction?: string
}

export interface UpdatePetDto {
  pet_name?: string
  pet_image?: string
  gender?: string
  variety?: string
  shelter_name?: string
  introduction?: string
}