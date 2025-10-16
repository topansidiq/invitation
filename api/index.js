import express from "express";
import ServerlessHttp from "serverless-http";
import path from "path";
import { fileURLToPath } from "url";
import config from '../knexfile.js';
import knexConstructor from "knex"; // Diubah namanya menjadi knexConstructor

const knexConfig = config.development;
// 🟢 INISIALISASI KNEX YANG BENAR
const db = knexConstructor(knexConfig);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// 🔹 Serve folder 'public' sebagai static
app.use(express.static(path.join(__dirname, "../public")));

// 🔹 Endpoint health check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK" });
});

// 🔹 Endpoint untuk tampilkan file HTML
app.get("/api/spec", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/api-spec.html"));
});

// RESTful
app.get('/api/guests', async (req, res) => {
    // 🟢 MENGGUNAKAN 'db'
    const guests = await db('guests').select('*');
    res.status(200).json({ status: 'success', message: `Successfully retrieved ${guests.length} guests data`, data: guests });
})

app.get('/api/guest/:id', async (req, res) => {
    // 🟢 MENGGUNAKAN 'db'
    const guest = await db('guests').select('*').where('id', req.params.id).first();
    if (!guest) return res.status(404).json({ status: 'error', message: 'Guest not found' });
    res.status(200).json({ status: 'success', message: `Successfully get guest with id ${req.params.id}`, data: guest });
})

app.post('/api/guest', async (req, res) => {
    // 🟢 MENGGUNAKAN 'db'
    const [id] = await db('guests').insert(req.body);
    const guest = await db('guests').select('*').where('id', id).first();
    res.status(201).json({ status: 'success', message: 'Successfully add new guest', data: guest });
})

app.put('/api/guest/:id', async (req, res) => {
    // 🟢 MENGGUNAKAN 'db'
    await db('guests').where('id', req.params.id).update(req.body);
    const guest = await db('guests').select('*').where('id', req.params.id).first();
    if (!guest) return res.status(404).json({ status: 'error', message: 'Guest not found' });
    res.status(200).json({ status: 'success', message: `Successfully update guest with id ${req.params.id}`, data: guest });
})

app.delete('/api/guest/:id', async (req, res) => {
    // 🟢 MENGGUNAKAN 'db'
    const deleted = await db('guests').where('id', req.params.id).del();
    if (deleted === 0) return res.status(404).json({ status: 'error', message: 'Guest not found to delete' });
    res.status(200).json({ status: 'success', message: 'Successfully deleted a guest', data: true });
})

// ✅ Export untuk serverless (Vercel)
export const handler = ServerlessHttp(app);

// 🔹 Jalankan lokal (opsional)
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}