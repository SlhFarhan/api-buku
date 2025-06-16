// Menggunakan model dan pustaka yang diperlukan
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // <-- PERBAIKAN 1: Mengimpor modul, bukan string
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto'); // <-- PERBAIKAN 2: Impor modul crypto untuk password aman

// Inisialisasi client dengan Client ID untuk validasi audience
// Pastikan GOOGLE_CLIENT_ID di file .env adalah tipe "Web Application"
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Fungsi register tidak berubah
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await User.create({ email, password: hashedPassword });
        res.status(201).send({ message: "User registered successfully!", userId: user.id });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Fungsi login tidak berubah
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ accessToken: null, message: "Invalid Password!" });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 });
        res.status(200).send({ id: user.id, email: user.email, accessToken: token });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// --- FUNGSI GOOGLE LOGIN YANG DIPERBAIKI ---
exports.googleLogin = async (req, res) => {
    const { token } = req.body; 

    try {
        // PERBAIKAN 3: Verifikasi token dengan 'audience' untuk keamanan
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(401).send({ message: "Invalid Google Token: Payload missing." });
        }
        
        const { email } = payload;

        const [user] = await User.findOrCreate({
            where: { email: email },
            defaults: {
                // PERBAIKAN 4: Membuat password acak yang aman untuk user Google
                password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 8),
            }
        });

        // Buat token JWT untuk sesi aplikasi Anda
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 jam
        });

        res.status(200).send({
            id: user.id,
            email: user.email,
            accessToken: accessToken
        });

    } catch (error) {
        // Memberikan pesan error yang lebih jelas jika verifikasi gagal
        console.error("Google login error:", error);
        res.status(401).send({ message: "Invalid Google Token or Audience Mismatch" });
    }
};