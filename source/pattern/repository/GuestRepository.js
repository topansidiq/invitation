import database from "../../database/app/database.js";

class GuestRepository {
    async getAll() {
        return await database.select('*').from('guests');
    }
    async getById(id) {
        return await database.select('*').from('guests').where({ id });
    }
    async create(data) {
        const [id] = await database.insert(data).into('guests');
        return this.getById(id);
    }
    async update(id, data) {
        await database.from('guests').where({ id }).update(data);
        return this.getById(id);
    }
    async delete(id) {
        await database.from('guests').where({ id }).delete();
        return true;
    }
    async drop() {
        await database.select('*').from('guests').delete();
        return true;
    }
}

export default new GuestRepository();