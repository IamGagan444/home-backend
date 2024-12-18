import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateTokens = async (userId) => {
  const user = await User.findById(userId);

  const accessToken = await user.generateAccessToken();
  const refresh_token = await user.generateRefreshToken();

  user.refresh_token = refresh_token;
  user.save({ validateBeforeSave: false });

  return { accessToken, refresh_token };
};

const userRegister = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body)

  const emptyField = ["email", "password"];

  const isEmptyField = emptyField.filter((field) => !req.body[field]?.trim());

  if (isEmptyField > 0) {
    next(
      new ApiError(
        400,
        `${isEmptyField.join(", ")} ${isEmptyField > 1 ? "are" : "is"} required!`,
      ),
    );
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    next(new ApiError(400, "user is already exists with this email"));
  }

  const user = await User.create({
    email,
    password,
  });

  if (!user) {
    next(new ApiError(500, " user registration failed "));
  }

  const { accessToken, refresh_token } = await generateTokens(user._id);

  const createdUser = await User.findById(user?._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refresh_token", refresh_token, options)
    .json(
      new ApiResponse(200, "user registration successfully", {
        users: createdUser,
        accessToken,
        refresh_token,
      }),
    );
});

const userLogin = AsyncHandler(async (req, res, next) => {
  // console.log(req);
  const { email, password } = req.body;

  if (!email) {
    next(new ApiError(400, "username or email is required"));
  }
  if (!password) {
    next(new ApiError(400, "password is required"));
  }

  const isUser = await User.findOne({ email });

  if (!isUser) {
    next(new ApiError(400, "user doesnot exists with this credentials!"));
  }

  const isPasswordValid = await isUser.isCorrectPassword(password);

  if (isPasswordValid) {
    next(new ApiError(400, "wrong password!"));
  }

  const { accessToken, refresh_token } = await generateTokens(isUser._id);

  const user = await User.findById(isUser?._id).select(
    "-password -refresh_token",
  );

  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refresh_token", refresh_token, options)
    .json(
      new ApiResponse(200, "user loggedin successfully", {
        user,
        accessToken,
        refresh_token,
      }),
    );
});

const refreshAccessToken = AsyncHandler(async (req, res, next) => {
  const incomingRefreshToken = req.cookies.refresh_token;

  if (!incomingRefreshToken) {
    next(new ApiError(400, "unauthorized user access", "/login"));
  }

  const decodedToken = await jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN,
  );

  if (!decodedToken) {
    next(new ApiError(400, "unauthorized user access", "/login"));
  }

  const user = await User.findById(decodedToken._id);
  if (!user) {
    next(new ApiError(400, "user doesnot exist", "/login"));
  }

  const { accessToken, newrefresh_token } = await generateTokens(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refresh_token", newrefresh_token, options)
    .json(
      new ApiResponse(200, "token refreshed successfully", {
        accessToken,
        refresh_token: newrefresh_token,
      }),
    );
});

const userLogout = AsyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    next(new ApiError(400, "please relogoin", "/login"));
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        refresh_token: "",
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refresh_token", options)
    .json(new ApiResponse(201, "user logged out successfully"));
});

export { userRegister, userLogin, userLogout };
