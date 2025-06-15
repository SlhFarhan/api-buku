// Menggunakan model Buku
const { Buku } = require('../models');
const fs = require('fs');

// Mengganti semua 'film' menjadi 'buku'
exports.getAllBuku = async (req, res) => {
    try {
        const bukus = await Buku.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.send(bukus);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.createBuku = async (req, res) => {
    try {
        // Destructuring body disesuaikan
        const { nama_buku, penulis_buku } = req.body;
        
        if (!req.file) {
            return res.status(400).send({ message: "Gambar harus di-upload." });
        }

        const imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

        const newBuku = await Buku.create({
            nama_buku,
            penulis_buku,
            gambar: imageUrl,
            userId: req.userId
        });
        res.status(201).send(newBuku);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateBuku = async (req, res) => {
    try {
        const buku = await Buku.findByPk(req.params.id);
        if (!buku) {
            return res.status(404).send({ message: "Buku not found" });
        }

        if (buku.userId !== req.userId) {
            return res.status(403).send({ message: "Forbidden: You don't own this book" });
        }
        
        let imageUrl = buku.gambar;
        if (req.file) {
            imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
        }
        
        const { nama_buku, penulis_buku } = req.body;
        await buku.update({
            nama_buku: nama_buku || buku.nama_buku,
            penulis_buku: penulis_buku || buku.penulis_buku,
            gambar: imageUrl
        });
        res.send({ message: "Buku updated successfully!", buku });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.deleteBuku = async (req, res) => {
    try {
        const buku = await Buku.findByPk(req.params.id);
        if (!buku) {
            return res.status(404).send({ message: "Buku not found" });
        }
        if (buku.userId !== req.userId) {
            return res.status(403).send({ message: "Forbidden" });
        }

        const filename = buku.gambar.split('/').pop();
        if (filename) {
            fs.unlink(`uploads/${filename}`, (err) => {
                if (err) console.error("Gagal menghapus file gambar lama:", err);
            });
        }
        
        await buku.destroy();
        res.send({ message: "Buku deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getBukuById = async (req, res) => {
    try {
        const buku = await Buku.findByPk(req.params.id);
        if (!buku) {
            return res.status(404).send({ message: "Buku not found" });
        }
        res.send(buku);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};