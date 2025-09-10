import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getTotalBill,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/total", getTotalBill);

export default router;
