import { CartProduct } from "../models/Cart.model.js";
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

const getProductByID = AsyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  if (!productId) {
    return next(new ApiError(400, "product id is required"));
  }

  const product = await Product.findById(productId);

  return res
    .status(200)
    .json(new ApiResponse(200, "product data fetched successfully", product));
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

const addToCartProduct = AsyncHandler(async (req, res, next) => {
  const { productId, userId } = req.body;
  if (!productId || !userId) {
    next(new ApiError(400, "something is missing in payload"));
  }

  const carts = await CartProduct.create({
    productId,
    userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "product carted successfully", carts));
});
const getAllCartProduct = AsyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    next(new ApiError(400, "userid is required!"));
  }

  const cartProducts = await CartProduct.find({ userId }).populate("productId");

  return res.status(200).json(
    new ApiResponse(
      200,
      "product fetched successfully",
      cartProducts.map((item) => item.productId),
    ),
  );
});

const removeCartProduct = AsyncHandler(async (req, res, next) => {
  const { userId, productId } = req.body;
  console.log(req.body);

  if (!userId || !productId) {
    return next(new ApiError(400, "userid and product id is required!"));
  }

  const removeProduct = await CartProduct.findOneAndDelete({
    userId,
    productId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "product deleted successfully"));
});

export {
  getAllProduct,
  postProduct,
  addToCartProduct,
  getAllCartProduct,
  removeCartProduct,
  getProductByID
};
