require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mengimpor route buku
const authRoutes = require('./routes/auth.routes.js');
const bukuRoutes = require('./routes/buku.routes.js');

// Menggunakan route buku dengan endpoint /api/buku
app.use('/api/auth', authRoutes);
app.use('/api/buku', bukuRoutes); // Endpoint diubah

// Rute dasar diubah
app.get('/', (req, res) => {
    res.send('Selamat Datang di Buku API! Waktu server: ' + new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});