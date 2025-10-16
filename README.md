# 💌 Invitation API — Undangan Digital

Sebuah **RESTful API** sederhana untuk aplikasi undangan digital.  
Dibangun menggunakan **Express.js**, **Knex.js**, dan **SQLite3** dengan arsitektur modular dan mudah dikembangkan.

---

## 🚀 Fitur Utama

- ✅ CRUD data tamu (Create, Read, Update, Delete)
- 🧩 Arsitektur modular (Controller → Service → Repository)
- 🗂 Database SQLite3 (ringan dan portabel)
- ⚙️ Migrasi database otomatis dengan Knex
- 🔄 Hot reload dengan Nodemon selama development

---

## 🧰 Teknologi yang Digunakan

| Komponen | Deskripsi |
|-----------|------------|
| **Node.js** | Runtime JavaScript |
| **Express.js** | Framework HTTP server |
| **Knex.js** | Query builder untuk database |
| **SQLite3** | Database ringan tanpa server |
| **Nodemon** | Auto-reload saat file berubah |
| **dotenv** | Mengatur variabel lingkungan |

---

## ⚙️ Instalasi & Konfigurasi

### 1️⃣ Clone Repository

```bash
git clone https://github.com/topansidiq/invitation.git
cd invitation
```

---

### 2️⃣ Install Dependencies

Pastikan Node.js sudah terpasang, lalu jalankan:

```bash
npm install
```

---

### 3️⃣ Konfigurasi Environment (.env)

Buat file `.env` di root folder project, lalu isi dengan:

```env
PORT=3211
URL=localhost
```

---

### 4️⃣ Jalankan Migrasi Database

Perintah berikut akan membuat file `database.sqlite` dan tabel `guests` otomatis:

```bash
npx knex migrate:latest --knexfile ./source/database/configuration/knexfile.js
```

Jika berhasil, akan muncul pesan:
```
Batch 1 run: 1 migrations
```

---

### 5️⃣ Jalankan Server Development

```bash
npm run dev
```

Server akan berjalan di:
```
http://localhost:3211
```

---

## 🌐 Endpoint API

| Metode | Endpoint | Deskripsi |
|--------|-----------|-----------|
| **GET** | `/api/guest` | Menampilkan daftar semua tamu |
| **GET** | `/api/guest/:id` | Menampilkan detail tamu berdasarkan ID |
| **POST** | `/api/guest` | Menambahkan tamu baru |
| **PUT** | `/api/guest/:id` | Mengubah data tamu berdasarkan ID |
| **DELETE** | `/api/guest/:id` | Menghapus tamu berdasarkan ID |

---

## 📬 Contoh Request & Response

### ➕ Menambah Data Tamu

**Request**
```bash
POST /api/guest
Content-Type: application/json
```

**Body**
```json
{
  "name": "Topan Sidiq",
  "email": "topan@example.com",
  "phone": "08123456789",
  "address": "Padang"
}
```

**Response**
```json
{
  "message": "Guest created successfully",
  "data": {
    "id": 1,
    "name": "Topan Sidiq",
    "email": "topan@example.com",
    "phone": "08123456789",
    "address": "Padang"
  }
}
```

---

### 🔍 Mendapatkan Semua Data Tamu

**Request**
```bash
GET /api/guest
```

**Response**
```json
[
  {
    "id": 1,
    "name": "Topan Sidiq",
    "email": "topan@example.com",
    "phone": "08123456789",
    "address": "Padang",
    "created_at": "2025-10-16T07:21:00.000Z"
  }
]
```

---

### ✏️ Mengupdate Data Tamu

**Request**
```bash
PUT /api/guest/1
Content-Type: application/json
```

**Body**
```json
{
  "name": "Topan Sidiq Update",
  "email": "topan.sidiq@example.com"
}
```

**Response**
```json
{
  "message": "Guest updated successfully"
}
```

---

### ❌ Menghapus Data Tamu

**Request**
```bash
DELETE /api/guest/1
```

**Response**
```json
{
  "message": "Guest deleted successfully"
}
```

---

## 🧱 Struktur Folder

```
source/
│
├── application/
│   └── server.js                # Inisialisasi Express
│
├── database/
│   ├── app/
│   │   └── database.js          # Konfigurasi koneksi Knex
│   ├── configuration/
│   │   └── knexfile.js          # Pengaturan database Knex
│   ├── migrations/              # File migrasi tabel
│   ├── seeds/                   # File seed data awal
│   └── sql/                     # File database SQLite (.sqlite)
│
├── pattern/
│   ├── controller/
│   │   └── GuestController.js
│   ├── service/
│   │   └── GuestService.js
│   └── repository/
│       └── GuestRepository.js
│
├── routes/
│   └── guest.js                 # Routing endpoint tamu
│
└── index.js                     # Entry utama aplikasi
```

---

## 🧩 Arsitektur Aplikasi

```
Request
  ↓
Route (/routes)
  ↓
Controller (/pattern/controller)
  ↓
Service (/pattern/service)
  ↓
Repository (/pattern/repository)
  ↓
Database (Knex + SQLite)
```

Pendekatan ini membuat kode **modular, mudah diuji, dan scalable** untuk pengembangan selanjutnya.

---

## 📄 Lisensi

Dibuat dengan ❤️ oleh **Topan Sidiq**  
Lisensi: **MIT License**
