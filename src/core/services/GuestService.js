import { database } from "../../application/database.js";
import helper from "../../lib/helper.js";
import GuestRepository from "../repositories/GuestRepository.js";

class GuestService {
    async listGuests() {
        return await GuestRepository.getAll();
    }
    async getGuest(id) {
        return await GuestRepository.getById(id);
    }
    async craeteGuest(data) {
        return await GuestRepository.create({
            primary_name: data.primary_name,
            secondary_name: data.secondary_name,
            phone: helper.formatPhonenumberTo62(data.phone),
            status: data.status || false,
            created_at: data.created_at || database.fn.now(),
            updated_at: data.updated_at || database.fn.now(),
        })
    }
    async updateGuest(id, data) {
        return await GuestRepository.update(id, {
            primary_name: data.primary_name,
            secondary_name: data.secondary_name,
            phone: helper.formatPhonenumberTo62(data.phone),
            status: data.status,
            updated_at: database.fn.now(),
        })
    }
    async deleteGuest(id) {
        return await GuestRepository.delete(id);
    }
    async dropGuests() {
        return await GuestRepository.drop();
    }
}

export default new GuestService();