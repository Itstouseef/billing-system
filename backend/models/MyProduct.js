import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      min: [0, "Price must be >= 0"],
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, "Quantity must be >= 1"],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-calculate totalPrice before save
productSchema.pre("save", function (next) {
  this.totalPrice = this.price * this.quantity;
  next();
});

// Auto-calculate totalPrice before findOneAndUpdate
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.price != null || update.quantity != null) {
    const price = update.price ?? this._update.$set.price;
    const quantity = update.quantity ?? this._update.$set.quantity;
    update.totalPrice = price * quantity;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
