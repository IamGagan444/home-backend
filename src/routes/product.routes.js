import { Router } from "express";
import {
  addToCartProduct,
  getAllCartProduct,
  getAllProduct,
  getProductByID,
  postProduct,
  removeCartProduct,
} from "../controller/product.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = Router();

router.route("/get-all-product").get(getAllProduct);
router.route("/post-product").post(postProduct);
router.route("/add-to-cart").post(verifyUser, addToCartProduct);
router.route("/get-all-cartproduct/:userId").get(verifyUser,getAllCartProduct)
router.route("/get-productby-id/:productId").get(verifyUser,getProductByID)
router.route("/remove-cart-product").post(verifyUser,removeCartProduct)


export default router;


