import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { mailTransporter } from "../utils/MailTransporter.js";

const getAllProduct = AsyncHandler(async (req, res, next) => {

  const products = await Product.find();

  return res
    .status(200)
    .json(new ApiResponse(200, "product data fetched successfully", products));
});

const postProduct = AsyncHandler(async (req, res, next) => {
  const { title, image, price } = req.body;
  if (!title || !image || !price) {
    return next(new ApiError(400, "you have to sent all data"));
  }

  const product = await Product.create({
    title,
    image,
    price,
  });
  if (product) {
    next(new ApiError(500, "internal server issue"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "product posted successfully", product));
});

export { getAllProduct, postProduct };
