import GuestRepository from "../repository/GuestRepository.js";

class GuestService {
    async listGuests() {
        return await GuestRepository.getAll();
    }
    async getGuest(id) {
        return await GuestRepository.getById(id);
    }
    async createGuest(data) {
        return await GuestRepository.create({
            primary_name: data.primary_name,
            secondary_name: data.secondary_name,
            phone: data.phone,
            status: data.status || false,
        });
    }
    async updateGuest(id, data) {
        return await GuestRepository.update(id, {
            primary_name: data.primary_name,
            secondary_name: data.secondary_name,
            phone: data.phone,
            status: data.status,
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