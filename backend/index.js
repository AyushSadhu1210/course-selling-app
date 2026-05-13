import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";

import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";

import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const frontendOrigin =
    (process.env.FRONTEND_URL || process.env.FRONTEFRONTND_URL || "http://localhost:5173")
        .replace(/\/$/, "");

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);
app.use(
    cors({
        origin: frontendOrigin,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

if (!DB_URI) {
    console.error("Missing MONGO_URI in backend/.env");
    process.exit(1);
}

try {
    await mongoose.connect(DB_URI, {
        serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");
} catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
}

// defining routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);

// Cloudinary configuration code
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
