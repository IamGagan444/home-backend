import mongoose, { Schema } from "mongoose";


const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },

    refresh_token: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
