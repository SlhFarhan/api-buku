'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // Nama class diubah menjadi Buku
  class Buku extends Model {
    static associate(models) {
      // Asosiasi ke model User tetap ada
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'owner' });
    }
  }
  Buku.init({
    // Field disesuaikan dengan model Buku
    nama_buku: DataTypes.STRING,
    penulis_buku: DataTypes.TEXT,
    gambar: DataTypes.STRING, // Field gambar tetap ada
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Buku', // Nama model diubah
  });
  return Buku;
};