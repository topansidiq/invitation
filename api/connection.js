import pg from "pg";

// Global variable untuk caching connection pool
let cachedPool = null;

/**
 * Mendapatkan atau membuat PostgreSQL connection pool
 * Menggunakan caching untuk menghindari pembuatan pool berulang kali
 * di environment serverless
 */
export function getPool() {
    // Jika pool sudah ada, gunakan yang sudah ada (connection reuse)
    if (cachedPool) {
        console.log("♻️  Reusing existing database pool");
        return cachedPool;
    }

    console.log("🔌 Creating new database pool");

    // Validasi environment variable
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set");
    }

    const isProduction = process.env.NODE_ENV === 'production';

    // Konfigurasi pool untuk serverless environment
    cachedPool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,

        // SSL Configuration
        ssl: isProduction ? {
            rejectUnauthorized: false
        } : false,

        // Serverless optimization settings
        max: 1, // PENTING: Minimal pool size untuk serverless (1 connection per instance)
        min: 0,
        idleTimeoutMillis: 30000,

        // REDUKSI TIMEOUT AGAR LEBIH RENDAH DARI VERCEL 10 DETIK
        connectionTimeoutMillis: 9000, // Timeout koneksi 9 detik

        // Query timeout (9 detik, agar tidak mencapai Vercel 10 detik timeout)
        statement_timeout: 9000,
        query_timeout: 9000,

        // Allow exit on idle
        allowExitOnIdle: true,
    });

    // Event listeners untuk debugging (opsional, bisa dihapus di production)
    cachedPool.on('connect', () => {
        console.log('✅ Database connected');
    });

    cachedPool.on('error', (err) => {
        console.error('❌ Unexpected database error:', err);
        // Reset cache jika ada error
        cachedPool = null;
    });

    cachedPool.on('remove', () => {
        console.log('🔌 Database connection removed from pool');
    });

    return cachedPool;
}

/**
 * Test koneksi database
 * Berguna untuk health check atau debugging
 */
export async function testConnection() {
    try {
        const pool = getPool();
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Database connection test successful:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('❌ Database connection test failed:', error.message);
        return false;
    }
}

/**
 * Menutup semua koneksi database
 * Berguna untuk cleanup atau testing
 */
export async function closePool() {
    if (cachedPool) {
        console.log('🔒 Closing database pool...');
        await cachedPool.end();
        cachedPool = null;
        console.log('✅ Database pool closed');
    }
}