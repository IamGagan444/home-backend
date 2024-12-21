import { Offer } from "../models/Offer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { transporter } from "../utils/MailTransporter.js";
import { Product } from "../models/product.model.js";

const makeOffer = AsyncHandler(async (req, res, next) => {
  const { productId, offeredPrice, userId, BuyerEmail, sellerId } = req.body;

  console.log({ productId, offeredPrice, userId, BuyerEmail, sellerId });

  // Validate input
  if (!userId || !productId || !offeredPrice || !BuyerEmail || !sellerId) {
    return next(
      new ApiError(
        400,
        "productId, offerPrice, userId, email, and sellerId are required!",
      ),
    );
  }

  // Check if an offer already exists
  const existingOffer = await Offer.findOne({ userId, productId });

  if (existingOffer) {
    // Update the existing offer
    existingOffer.offeredPrice = offeredPrice;
    await existingOffer.save();

    // Send email notification
    const mailOptions = {
      from: "gaganpalai987@gmail.com",
      to: "gaganjobs09@gmail.com",
      subject: "Offer Updated",
      text: `An existing offer has been updated:
Product ID: ${productId}
New Offer Price: $${offeredPrice}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    return res.json({
      success: true,
      message: "Offer updated successfully",
      offer: existingOffer,
    });
  }

  // Create a new offer if it doesn't exist
  const newOffer = new Offer({
    productId,
    offeredPrice,
    userId,
    BuyerEmail,
    sellerId,
  });
  await newOffer.save();

  // Send email notification for a new offer
  const mailOptions = {
    from: "gaganpalai987@gmail.com",
    to: "gaganjobs09@gmail.com",
    subject: "New Offer Received",
    text: `A new offer has been made:
Product ID: ${productId}
Offer Price: $${offeredPrice}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });

  res.json({
    success: true,
    message: "Offer created successfully",
    offer: newOffer,
  });
});

//this api will use for selere side to check how many offer seller has got
const getOffer = AsyncHandler(async (req, res, next) => {
  const { sellerId } = req.params;
  console.log(sellerId);
  if (!sellerId) {
    next(new ApiError(400, "selleri d is required!"));
  }

  const offers = await Offer.find({ sellerId }).populate("productId");
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
    .json(new ApiResponse(200, "offer fetched successfully", offers));
});

const viewOffer = AsyncHandler(async (req, res, next) => {
  const { productId, userId } = req.body;

  if (!productId || !userId) {
    return next(new ApiError(400, "ids are required"));
  }

  const offers = await Offer.findOne({ productId, userId }).populate(
    "productId",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "offer fetched succesfully", offers));
});

const acceptOffer = AsyncHandler(async (req, res, next) => {
  const { offerId, sellerId, offeredPrice } = req.body;
  console.log(req.body);

  if (!offerId || !sellerId || !offeredPrice) {
    return next(new ApiError(400, "both is required"));
  }

  const offer = await Offer.findOneAndUpdate(
    { _id: offerId, sellerId },
    { status: "accept" },
    { new: true },
  );
  console.log("offer", offer);
  const product = await Product.findByIdAndUpdate(
    offer?.productId,
    {
      offeredPrice,
    },
    { new: true },
  );
  console.log("product", product);

  const mailOptions = {
    from: "gaganpalai987@gmail.com",
    to: "gaganjobs09@gmail.com",
    subject: "Offer Accepted",
    text: `A new offer has been made:Product ID: ${offer?.productId._id}Offer Price: $${offer.offeredPrice}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });

  return res.status(200).json(new ApiResponse(200, "offer accepted", offer));
});

const rejectOffer = AsyncHandler(async (req, res, next) => {
  const { offerId, sellerId } = req.body;
  console.log(req.body);

  if (!offerId || !sellerId ) {
    return next(new ApiError(400, "both is required"));
  }

  const offer = await Offer.findOneAndUpdate(
    { _id: offerId, sellerId },
    { status: "reject" },
    { new: true },
  );
  console.log("offer", offer);


  const mailOptions = {
    from: "gaganpalai987@gmail.com",
    to: "gaganjobs09@gmail.com",
    subject: "Offer Rejected",
    text: `A new offer has been made:Product ID: ${offer?.productId._id}Offer Price: $${offer.offeredPrice}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });

  return res.status(200).json(new ApiResponse(200, "offer rejected", offer));
});

export { makeOffer, getOffer, viewOffer, acceptOffer, rejectOffer };
