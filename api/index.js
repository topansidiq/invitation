import express from "express";
import ServerlessHttp from "serverless-http";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg"; // Menggunakan driver pg secara langsung

// --- INISIALISASI DATABASE ---
// Di Vercel, process.env.NODE_ENV akan menjadi 'production'
const isProduction = process.env.NODE_ENV === 'production';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    // Konfigurasi tambahan untuk Vercel/Neon
    ssl: isProduction ? {
        rejectUnauthorized: false
    } : false,
});

// --- INISIALISASI SERVER ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve folder 'public' sebagai static
app.use(express.static(path.join(__dirname, "../public")));

// --- ROUTES ---

// Endpoint Health Check (Akses di Vercel: /api/health)
app.get("/health", (req, res) => {
    res.json({ status: "OK", db_client: "pg" });
});

// Endpoint untuk tampilkan file HTML (Akses di Vercel: /api/spec)
app.get("/spec", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/api-spec.html"));
});

// RESTful - GET All Guests (Akses di Vercel: /api/guests)
app.get('/guests', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM guests');
        const guests = result.rows;
        res.status(200).json({ status: 'success', message: `Successfully retrieved ${guests.length} guests data`, data: guests });
    } catch (error) {
        // Log error untuk diagnosis di Vercel Logs
        console.error("Error retrieving guests:", error);
        res.status(500).json({ status: 'error', message: 'Database error retrieving guests.', details: error.message });
    }
});

// GET Guest by ID
app.get('/guest/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM guests WHERE id = $1', [id]);
        const guest = result.rows[0];
        if (!guest) return res.status(404).json({ status: 'error', message: 'Guest not found' });
        res.status(200).json({ status: 'success', message: `Successfully get guest with id ${id}`, data: guest });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Database error retrieving guest.', details: error.message });
    }
});

// POST New Guest
app.post('/guest', async (req, res) => {
    const { guest_name, attendance_status } = req.body; // Ganti dengan field yang sesuai di tabel Anda
    if (!guest_name) {
        return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }

    try {
        const queryText = 'INSERT INTO guests(guest_name, attendance_status) VALUES($1, $2) RETURNING *';
        const result = await pool.query(queryText, [guest_name, attendance_status || 'not confirmed']);
        const guest = result.rows[0];
        res.status(201).json({ status: 'success', message: 'Successfully add new guest', data: guest });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Database error adding new guest.', details: error.message });
    }
});

// PUT Update Guest
app.put('/guest/:id', async (req, res) => {
    const { id } = req.params;
    const { guest_name, attendance_status } = req.body;

    try {
        const result = await pool.query('UPDATE guests SET guest_name = $1, attendance_status = $2 WHERE id = $3 RETURNING *',
            [guest_name, attendance_status, id]);

        const guest = result.rows[0];
        if (!guest) return res.status(404).json({ status: 'error', message: 'Guest not found' });

        res.status(200).json({ status: 'success', message: `Successfully update guest with id ${id}`, data: guest });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Database error updating guest.', details: error.message });
    }
});

// DELETE Guest
app.delete('/guest/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM guests WHERE id = $1 RETURNING id', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ status: 'error', message: 'Guest not found to delete' });
        }

        res.status(200).json({ status: 'success', message: 'Successfully deleted a guest', data: true });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Database error deleting guest.', details: error.message });
    }
});


// ✅ Export untuk serverless (Vercel)
export const handler = ServerlessHttp(app);

// 🔹 Jalankan lokal (opsional)
if (!isProduction) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}