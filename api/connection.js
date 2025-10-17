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
            rejectUnauthorized: false // Diperlukan untuk Neon, Supabase, dll
        } : false,

        // Serverless optimization settings
        max: 1, // PENTING: Minimal pool size untuk serverless (1 connection per instance)
        min: 0, // Tidak perlu minimum connection
        idleTimeoutMillis: 30000, // Close idle connections setelah 30 detik
        connectionTimeoutMillis: 10000, // Timeout koneksi 10 detik

        // Query timeout
        statement_timeout: 30000, // Query timeout 30 detik
        query_timeout: 30000,

        // Allow exit on idle
        allowExitOnIdle: true, // Penting untuk serverless
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