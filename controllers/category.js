/**
 * Dependencies
 */
const Category = require('../models/category');

/**
 * Actions
 */
const getAll = async (req, res) =>
  Category.find()
    .then((categories) => {
      if (!categories.length) {
        return res.status(404).json({ message: 'Categories Not Found' });
      }
      return res.status(200).json(categories);
    })
    .catch((error) => res.status(400).json({ message: error.message, error: error.errors }));

const getCategory = async () => {};
const createCategory = async () => {};

module.exports = {
  getAll,
  getCategory,
  createCategory,
};
