import { createClient } from "@/config/server"
export class BaseService {
    async createClient() {
        const supabase = await createClient()
        return supabase
    }
}