
import {Router} from "express"
import { getOffer, makeOffer, viewOffer } from "../controller/Offer.controller.js"
import{ verifyUser }from "../middlewares/verifyUser.js"
const router =Router()

router.route("/make-offer").post(verifyUser,makeOffer)
router.route("/view-offer").post(verifyUser,viewOffer)
router.route("/get-offer/:sellerId").get(verifyUser,getOffer)

export default router;



