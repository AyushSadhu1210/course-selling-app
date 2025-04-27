import express from "express";
import userMiddleware from "../middelwares/user.mid.js";
import { orderData } from "../controller/order.controller.js";


const router = express.Router();

router.post("/", userMiddleware, orderData);

export default router;
