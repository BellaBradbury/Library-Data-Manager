'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validat: {
        notEmpty: {
          msg: "Book must have a TITLE value.",
        },
      },
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validat: {
        notEmpty: {
          msg: "Book must have an AUTHOR value.",
        },
      },
    },
    genre: {
      type: Sequelize.STRING,
    },
    year: {
      type: Sequelize.INTEGER,
    },
  {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};
