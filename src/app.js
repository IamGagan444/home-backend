import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middlewares/Error.middleware.js";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:5173/",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// app.use(cors({
//   origin: (origin, callback) => {
//     // Allow requests from your dev tunnel URL
//     const allowedOrigins = ['https://1h2qj3x1-3000.inc1.devtunnels.ms'];
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

app.use(express.static("public"));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import offerRoutes from "./routes/offer.routes.js";

app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", offerRoutes);

app.use(ErrorMiddleware);



