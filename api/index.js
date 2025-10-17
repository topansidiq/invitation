import express from "express";
import ServerlessHttp from "serverless-http";
import path from "path";
import { fileURLToPath } from "url";
import config from '../knexfile.js';
import knexConstructor from "knex";
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const knexConfig = config[environment];
// 🟢 PERBAIKAN KNEX: Objek koneksi disimpan dalam variabel 'db'
const db = knexConstructor(knexConfig);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json());

// 🔹 Serve folder 'public' sebagai static
// Note: Akses file statis di Vercel biasanya melalui path root, bukan /api/...
app.use(express.static(path.join(__dirname, "../public")));

// 🟢 PERBAIKAN VERCEL: Hapus awalan /api/ dari semua route Express

// 🔹 Endpoint health check (Akses di Vercel: /api/health)
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

// 🔹 Endpoint untuk tampilkan file HTML (Akses di Vercel: /api/spec)
app.get("/spec", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/api-spec.html"));
});

// RESTful
// (Akses di Vercel: /api/guests)
app.get('/guests', async (req, res) => {
    try {
        const guests = await db('guests').select('*');
        res.status(200).json({ status: 'success', message: `Successfully retrieved ${guests.length} guests data`, data: guests });
    } catch (error) {
        // Tambahkan error handling, terutama untuk masalah database
        res.status(500).json({ status: 'error', message: 'Database error retrieving guests.', details: error.message });
    }
});

// (Akses di Vercel: /api/guest/:id)
app.get('/guest/:id', async (req, res) => {
    try {
        const guest = await db('guests').select('*').where('id', req.params.id).first();
        if (!guest) return res.status(404).json({ status: 'error', message: 'Guest not found' });
        res.status(200).json({ status: 'success', message: `Successfully get guest with id ${req.params.id}`, data: guest });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Database error retrieving guest.', details: error.message });
    }
});

app.post('/guest', async (req, res) => {
    try {
        const [id] = await db('guests').insert(req.body);
        const guest = await db('guests').select('*').where('id', id).first();
        res.status(201).json({ status: 'success', message: 'Successfully add new guest', data: guest });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Database error adding new guest.', details: error.message });
    }
});

app.put('/guest/:id', async (req, res) => {
    try {
        await db('guests').where('id', req.params.id).update(req.body);
        const guest = await db('guests').select('*').where('id', req.params.id).first();
        if (!guest) return res.status(404).json({ status: 'error', message: 'Guest not found' });
        res.status(200).json({ status: 'success', message: `Successfully update guest with id ${req.params.id}`, data: guest });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Database error updating guest.', details: error.message });
    }
});

app.delete('/guest/:id', async (req, res) => {
    try {
        const deleted = await db('guests').where('id', req.params.id).del();
        if (deleted === 0) return res.status(404).json({ status: 'error', message: 'Guest not found to delete' });
        res.status(200).json({ status: 'success', message: 'Successfully deleted a guest', data: true });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Database error deleting guest.', details: error.message });
    }
});

// ✅ Export untuk serverless (Vercel)
export const handler = ServerlessHttp(app);

// 🔹 Jalankan lokal (opsional)
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}