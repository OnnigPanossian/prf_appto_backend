/**
 * Dependencies
 */
const Category = require('../models/category');

/**
 * Actions
 */
const getAll = async (req, res) => Category.find()
  .then((categories) => {
    if (!categories.length) {
      return res.status(404).json({ message: 'Categories Not Found' });
    }
    return res.status(200).json(categories);
  })
  .catch((error) => res.status(400).json({ message: error.message, error: error.errors }));

const getCategory = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category Not Found' });
    }
    return res.json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message, error: error.errors });
  }
};

const createCategory = async (req, res) => {
  const { body } = req;
  const category = new Category(body);
  try {
    await category.save();
    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message, error: error.errors });
  }
};

module.exports = {
  getAll,
  getCategory,
  createCategory,
};
