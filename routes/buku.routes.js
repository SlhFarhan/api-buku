const express = require('express');
const router = express.Router();
// Menggunakan controller buku
const controller = require('../controllers/buku.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

// Mengganti nama fungsi controller
router.get('/', controller.getAllBuku);
router.get('/:id', controller.getBukuById);

router.post('/', [verifyToken, upload.single('gambar')], controller.createBuku);
router.put('/:id', [verifyToken, upload.single('gambar')], controller.updateBuku);
router.delete('/:id', [verifyToken], controller.deleteBuku);

module.exports = router;