import { AdoptDTO, AdoptRecord } from "@/model/adoptModel";
import { BaseService } from "./base/base_service";

export class AdoptService extends BaseService {
    // 新增領養申請
    async createAdoptApplication(data: AdoptDTO): Promise<AdoptRecord> {
        const supabase = await this.createClient();
        const { data: application, error } = await supabase
            .from('adopt_record')
            .insert(data)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        if (!application) {
            throw new Error('Failed to create adopt application');
        }

        return application;
    }

    // 透過使用者帳號取得領養申請紀錄
    async getAdoptApplicationsByUser(user_account: string): Promise<AdoptRecord[]> {
        const supabase = await this.createClient();
        const { data: applications, error } = await supabase
            .from('adopt_record')
            .select('record_id, user_account, pet(*),users(*)')
            .eq('user_account', user_account);

        if (error) {
            throw new Error(error.message);
        }

        // 轉換資料格式：將陣列轉為單一物件
        const formattedApplications = (applications || []).map((app: any) => ({
            record_id: app.record_id,
            user_account: app.user_account,
            pet: Array.isArray(app.pet) ? app.pet[0] : app.pet,
            users: Array.isArray(app.users) ? app.users[0] : app.users,
        }));

        return formattedApplications as AdoptRecord[];
    }
    // 刪除領養申請
    async deleteAdoptApplication(record_id: number): Promise<void> {
        const supabase = await this.createClient();
        const { error } = await supabase
            .from('adopt_record')
            .delete()
            .eq('record_id', record_id);

        if (error) {
            throw new Error(error.message);
        }
    }
}