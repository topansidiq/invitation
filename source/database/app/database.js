import knex from "knex";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 pastikan path absolut ke file SQLite
const dbPath = path.resolve(__dirname, "../sql/database.sqlite");

// Debug log (opsional)
console.log("🗂 Database path:", dbPath);

const database = knex({
    client: "sqlite3",
    connection: { filename: dbPath },
    useNullAsDefault: true,
});

export default database;
