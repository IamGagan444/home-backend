import { Offer } from "../models/Offer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { transporter } from "../utils/MailTransporter.js";

const makeOffer = AsyncHandler(async (req, res, next) => {
  const { productId, offerPrice, description, userId } = req.body;
  if(!userId||!productId||!offerPrice){
    next(new ApiError(400,"userid is required!"))
  }

  const offer = new Offer({ userId, productId, offerPrice, description });
  await offer.save();

  // Send email
  const mailOptions = {
    from: "gaganpalai987@gmail.com",
    to: "gaganjobs09@gmail.com",
    subject: "New Offer Received",
    text: `A new offer has been made:\nProduct ID: ${productId}\nOffer Price: $${offerPrice}\nDescription: ${description}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });

  res.json({ success: true, message: "Offer sent successfully" });
});

const getOffer = AsyncHandler(async (req, res, next) => {
  const{ userId} = req.body;
  console.log(userId)
  if(!userId){
    next(new ApiError(400,"userid is required!"))
  }

  const offers = await Offer.find({ userId }).populate("productId");
  //   res.json(
  //     offers.map((offer) => ({
  //       id: offer._id,
  //       productId: offer.productId._id,
  //       productName: offer.productId.name,
  //       offerPrice: offer.offerPrice,
  //       description: offer.description,
  //     })),
  //   )

  return res
    .status(200)
    .json(
       new ApiResponse(200, "offer fetched successfully", offers),
    );
});

export { makeOffer, getOffer };
