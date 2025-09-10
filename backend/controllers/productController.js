import Product from "../models/MyProduct.js";

// Centralized error helper
const handleError = (res, error, message = "Server Error", status = 500) =>
  res.status(status).json({ message, error: error.message });

// @desc Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Add a new product
export const addProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    if (!name || price == null) return res.status(400).json({ message: "Name and price required" });

    const product = new Product({ name, price, quantity: quantity ?? 1 });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Update a product
export const updateProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, quantity },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product removed" });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc Get total bill
export const getTotalBill = async (req, res) => {
  try {
    const products = await Product.find();
    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    res.json({ total });
  } catch (error) {
    handleError(res, error, "Error calculating total bill");
  }
};
