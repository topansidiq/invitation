import { database } from "../../application/database.js";

class GuestRepository {
    async getAll() {
        return await database("guests").select("*");
    }

    async getById(id) {
        return await database("guests").where({ id }).first();
    }

    async create(data) {
        const [guest] = await database("guests")
            .insert(data)
            .returning("*"); // penting untuk PostgreSQL!
        return guest;
    }

    async update(id, data) {
        const [updated] = await database("guests")
            .where({ id })
            .update(data)
            .returning("*");
        return updated;
    }

    async delete(id) {
        await database("guests").where({ id }).del();
        return true;
    }

    async drop() {
        await database('guests').del();
        await this.resetSequence();
        return true;
    }


    async resetSequence() {
        await database.raw(`ALTER SEQUENCE guests_id_seq RESTART WITH 1`);
    }

}

export default new GuestRepository();
