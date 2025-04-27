import express from "express";


import { buyCourses, courseDetails, createCourse, deleteCourse, getCourses, updateCourse } from "../controller/course.controller.js";
import adminMiddleware from "../middelwares/admin.mid.js";
import userMiddleware from "../middelwares/user.mid.js";

const router = express.Router();

router.post("/create", adminMiddleware, createCourse);
router.put("/update/:courseId", adminMiddleware, updateCourse);
router.delete("/delete/:courseId", adminMiddleware, deleteCourse);

router.get("/courses", getCourses);
router.get("/:courseId", courseDetails);

router.post("/buy/:courseId", userMiddleware, buyCourses);

export default router;
