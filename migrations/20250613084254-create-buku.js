'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Nama tabel di database menjadi 'Bukus'
    await queryInterface.createTable('Bukus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // Kolom disesuaikan dengan model Buku
      nama_buku: {
        type: Sequelize.STRING
      },
      penulis_buku: {
        type: Sequelize.TEXT
      },
      gambar: {
        type: Sequelize.STRING // Kolom gambar tetap
      },
      userId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bukus');
  }
};