import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  offeredPrice: {
    type: String,
    required: true,
  },
  BuyerEmail: {
    type: String,
    required: true,
  },
  status:{
    type:String,
    enum:["accept","pending","reject","counter"],
    default:"pending"
  }
  
});

export const Offer =
  mongoose.models.Offer || mongoose.model("Offer", OfferSchema);
