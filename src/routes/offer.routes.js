
import {Router} from "express"
import { getOffer, makeOffer } from "../controller/Offer.controller.js"
const router =Router()

router.route("/make-offer").post(makeOffer)
router.route("/get-offer").post(getOffer)

export default router;



