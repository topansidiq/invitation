import dotenv from "dotenv";
dotenv.config(); // Load .env file

import express from "express";
import serverless from "serverless-http";
import path from "path";
import { fileURLToPath } from "url";
import { getPool } from "./connection.js";

// Setup __dirname untuk ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve static files (kalau perlu)
app.use(express.static(path.join(__dirname, "../public")));

// Get database pool
const pool = getPool();

// --- ROUTES ---

// Health Check
app.get("/", (req, res) => {
    res.json({
        status: "OK",
        message: "API is running",
        timestamp: new Date().toISOString()
    });
});

app.get("/health", (req, res) => {
    res.json({ status: "OK", db_client: "pg" });
});

// Serve API Spec HTML
app.get("/spec", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/api-spec.html"));
});

// GET All Guests
app.get('/guests', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM guests ORDER BY id');
        const guests = result.rows;
        res.status(200).json({
            status: 'success',
            message: `Successfully retrieved ${guests.length} guests`,
            data: guests
        });
    } catch (error) {
        console.error("Error retrieving guests:", error);
        res.status(500).json({
            status: 'error',
            message: 'Database error retrieving guests',
            details: error.message
        });
    }
});

// GET Guest by ID
app.get('/guest/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM guests WHERE id = $1', [id]);
        const guest = result.rows[0];

        if (!guest) {
            return res.status(404).json({
                status: 'error',
                message: 'Guest not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Successfully retrieved guest with id ${id}`,
            data: guest
        });
    } catch (error) {
        console.error("Error retrieving guest:", error);
        res.status(500).json({
            status: 'error',
            message: 'Database error retrieving guest',
            details: error.message
        });
    }
});

// POST New Guest
app.post('/guest', async (req, res) => {
    const { guest_name, attendance_status } = req.body;

    if (!guest_name) {
        return res.status(400).json({
            status: 'error',
            message: 'guest_name is required'
        });
    }

    try {
        const queryText = 'INSERT INTO guests(guest_name, attendance_status) VALUES($1, $2) RETURNING *';
        const result = await pool.query(queryText, [
            guest_name,
            attendance_status || 'not confirmed'
        ]);
        const guest = result.rows[0];

        res.status(201).json({
            status: 'success',
            message: 'Successfully added new guest',
            data: guest
        });
    } catch (error) {
        console.error("Error adding guest:", error);
        res.status(500).json({
            status: 'error',
            message: 'Database error adding guest',
            details: error.message
        });
    }
});

// PUT Update Guest
app.put('/guest/:id', async (req, res) => {
    const { id } = req.params;
    const { guest_name, attendance_status } = req.body;

    if (!guest_name && !attendance_status) {
        return res.status(400).json({
            status: 'error',
            message: 'At least one field is required to update'
        });
    }

    try {
        const result = await pool.query(
            'UPDATE guests SET guest_name = $1, attendance_status = $2 WHERE id = $3 RETURNING *',
            [guest_name, attendance_status, id]
        );

        const guest = result.rows[0];

        if (!guest) {
            return res.status(404).json({
                status: 'error',
                message: 'Guest not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Successfully updated guest with id ${id}`,
            data: guest
        });
    } catch (error) {
        console.error("Error updating guest:", error);
        res.status(500).json({
            status: 'error',
            message: 'Database error updating guest',
            details: error.message
        });
    }
});

// DELETE Guest
app.delete('/guest/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM guests WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Guest not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Successfully deleted guest',
            data: { id: result.rows[0].id }
        });
    } catch (error) {
        console.error("Error deleting guest:", error);
        res.status(500).json({
            status: 'error',
            message: 'Database error deleting guest',
            details: error.message
        });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.path
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        details: err.message
    });
});

// Export untuk Vercel (serverless)
export default serverless(app);

// Untuk testing lokal (opsional)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        console.log(`📝 API Docs: http://localhost:${PORT}/spec`);
    });
}