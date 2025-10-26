import { Pet } from "./petModel";
import { Users } from "./userModel";

export interface AdoptDTO{
    pet_id: string;
    user_account: string;
}
export interface AdoptRecord{
    record_id: string;
    pet:Pet
    users:Users
}