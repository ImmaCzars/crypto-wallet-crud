## 💰 Crypto Wallet API

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-blue?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Crypto Wallet API adalah aplikasi backend berbasis **Node.js + Express** yang menyediakan fitur manajemen dompet digital sederhana dengan **PostgreSQL** sebagai database.  
Proyek ini dibuat untuk belajar konsep **CRUD**, transaksi keuangan, dan integrasi database secara real-world.

## 🚀 Fitur Utama
- **Create Wallet** – Membuat dompet baru dengan saldo awal.
- **Get Wallets** – Menampilkan semua wallet yang ada.
- **Deposit** – Menambahkan saldo ke wallet.
- **Withdrawal** – Mengurangi saldo dari wallet (dengan validasi saldo cukup).
- **Get Transactions** – Menampilkan riwayat transaksi per wallet (dengan filter `type`).
- **Delete Wallet** – Menghapus dompet beserta datanya.
- **Update Wallet** – Memperbarui informasi wallet.
  
## 🛠️ Teknologi yang Digunakan
- **Node.js** – Runtime JavaScript
- **Express.js** – Framework backend
- **PostgreSQL** – Database relasional
- **pg** – PostgreSQL client untuk Node.js
- **Nodemon** – Development auto-restart server

## 📂 Struktur Project
```

crypto-wallet/
│── src/
│   ├── controllers/
│   │   └── walletController.js
│   ├── routes/
│   │   └── walletRoutes.js
│   ├── db.js
│   └── server.js
│── package.json
│── README.md

````

---

## 📌 Endpoint API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| **GET** | `/wallets` | Ambil semua wallet |
| **POST** | `/wallets` | Buat wallet baru |
| **PUT** | `/wallets/:id` | Update wallet |
| **DELETE** | `/wallets/:id` | Hapus wallet |
| **POST** | `/wallets/:id/deposit` | Deposit saldo |
| **POST** | `/wallets/:id/withdraw` | Tarik saldo |
| **GET** | `/wallets/:id/transactions` | Ambil semua transaksi wallet |
| **GET** | `/wallets/:id/transactions?type=deposit` | Filter transaksi deposit |
| **GET** | `/wallets/:id/transactions?type=withdrawal` | Filter transaksi withdrawal |

---

## ⚡ Cara Menjalankan
1. Clone repository ini
   ```bash
   git clone https://github.com/username/crypto-wallet.git
   cd crypto-wallet
````

2. Install dependencies

   ```bash
   npm install
   ```
3. Atur file `.env`

   ```
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=crypto_wallet
   PORT=5000
   ```
4. Jalankan server
   ```bash
   npm run dev
5. Test API menggunakan **Postman** atau **Insomnia**
## Contoh Request & Response
**Buat Wallet Baru**

```http
POST /wallets
Content-Type: application/json

{
    "name": "Nanda",
    "balance": 100000
}
```
**Response**
```json
{
    "id": 1,
    "name": "Nanda",
    "balance": 100000
}
```
**Deposit**
```http
POST /wallets/1/deposit
Content-Type: application/json

{
    "amount": 50000
}
```
**Response**

```json
{
    "message": "Deposit berhasil",
    "wallet": {
        "id": 1,
        "name": "Nanda",
        "balance": 150000
    }
}
```
