import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    refresh_token: {
      type: String,
    },
  },
  { timestamps: true }
);

export const CartProduct =
  mongoose.models.CartProduct || mongoose.model("CartProduct", cartSchema);
