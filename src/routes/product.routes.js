import { Router } from "express";
import { getAllProduct, postProduct } from "../controller/product.controller.js";

const router = Router()

router.route("/get-all-product").get(getAllProduct)
router.route("/post-product").post(postProduct)


export default router;


