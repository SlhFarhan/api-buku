'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Nama tabel diubah menjadi 'Bukus'
    await queryInterface.bulkInsert('Bukus', [
      {
        // Data disesuaikan untuk buku
        nama_buku: 'Laskar Pelangi',
        penulis_buku: 'Andrea Hirata',
        gambar: 'https://upload.wikimedia.org/wikipedia/id/8/8e/Laskar_pelangi_sampul.jpg',
        userId: null, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_buku: 'Bumi Manusia',
        penulis_buku: 'Pramoedya Ananta Toer',
        gambar: 'https://upload.wikimedia.org/wikipedia/id/thumb/0/03/Bumi_Manusia_sampul.jpg/220px-Bumi_Manusia_sampul.jpg',
        userId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Bukus', null, {});
  }
};