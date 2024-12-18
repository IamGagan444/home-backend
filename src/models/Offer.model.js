import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    productId: mongoose.Schema.Types.ObjectId,
    offerPrice: Number,
    description: String,
  });

  export const Offer=mongoose.models.Offer||mongoose.model("Offer",OfferSchema)
