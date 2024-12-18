import { Router } from "express";

import {  userLogin, userLogout, userRegister } from "../controller/user.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";



const router = Router();
router.route("/user-registration").post(userRegister);
router.route("/user-login").post(userLogin);
router.route("/logout").get(verifyUser,userLogout)



router.route("/logout").get(function(req,res){
  req.logOut()
  res.redirect("/")
})

export default router;


