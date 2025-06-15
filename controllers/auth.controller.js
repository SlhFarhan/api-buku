const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = 'jsonwebtoken';
const { OAuth2Client } = require('google-auth-library');

// Inisialisasi client tanpa client ID karena tidak akan digunakan untuk validasi audience
const client = new OAuth2Client();

// ... (fungsi register dan login biasa tidak berubah) ...
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


// --- BAGIAN YANG DIPERBARUI ---
// Handler untuk login dengan Google
exports.googleLogin = async (req, res) => {
    const { token } = req.body; 

    try {
        // Verifikasi token tanpa memeriksa 'audience' (client ID)
        const ticket = await client.verifyIdToken({
            idToken: token,
            // audience: process.env.GOOGLE_CLIENT_ID, // <-- BARIS INI DIHAPUS/DIKOMENTARI
        });

        const payload = ticket.getPayload();
        // Jika payload null atau tidak ada email, token dianggap tidak valid
        if (!payload || !payload.email) {
            return res.status(401).send({ message: "Invalid Google Token: Payload missing." });
        }
        
        const { email } = payload;

        // Cari atau buat user baru berdasarkan email
        const [user] = await User.findOrCreate({
            where: { email: email },
            defaults: {
                // Buat password acak untuk user yang login via Google
                password: await bcrypt.hash(Math.random().toString(36), 8),
            }
        });

        // Buat token JWT untuk sesi aplikasi
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 jam
        });

        res.status(200).send({
            id: user.id,
            email: user.email,
            accessToken: accessToken
        });

    } catch (error) {
        // Tangani error jika token tidak valid sama sekali
        console.error("Google login error:", error);
        res.status(401).send({ message: "Invalid Google Token" });
    }
};