import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchase.model.js";

const allowedImageFormats = ["image/png", "image/jpeg"];

const uploadCourseImage = async (file) => {
  if (!allowedImageFormats.includes(file.mimetype)) {
    return {
      error: "Invalid file format. Only PNG and JPG are allowed",
      status: 400,
    };
  }

  try {
    const cloud_response = await cloudinary.uploader.upload(file.tempFilePath);
    if (!cloud_response || cloud_response.error) {
      return { error: "Error uploading file to cloudinary", status: 400 };
    }
    return {
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      },
    };
  } catch (uploadError) {
    console.log(uploadError);
    const message =
      uploadError?.message || "Error uploading file to cloudinary";
    const isConfigError =
      message.includes("Unknown API key") ||
      message.includes("Invalid cloud_name") ||
      message.includes("cloud_name mismatch");
    return {
      error: isConfigError
        ? "Image upload is misconfigured. Set cloud_name, api_key, and api_secret in backend/.env, then restart the server."
        : message,
      status: isConfigError ? 503 : 400,
    };
  }
};

export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;
  console.log(title, description, price);

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ errors: "No file uploaded" });
    }

    const { image } = req.files;
    if (!image) {
      return res.status(400).json({ errors: "Course image is required" });
    }

    const uploadResult = await uploadCourseImage(image);
    if (uploadResult.error) {
      return res.status(uploadResult.status).json({ errors: uploadResult.error });
    }

    const courseData = {
      title,
      description,
      price,
      image: uploadResult.image,
      creatorId: adminId,
    };
    const course = await Course.create(courseData);
    res.json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: error.message || "Error creating course",
    });
  }
};

export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price } = req.body;
  try {
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({ errors: "Course not found" });
    }

    const updateData = {
      title,
      description,
      price,
    };

    const newImage = req.files?.image || req.files?.imageUrl;
    if (newImage) {
      const uploadResult = await uploadCourseImage(newImage);
      if (uploadResult.error) {
        return res
          .status(uploadResult.status)
          .json({ errors: uploadResult.error });
      }
      updateData.image = uploadResult.image;

      if (courseSearch.image?.public_id) {
        try {
          await cloudinary.uploader.destroy(courseSearch.image.public_id);
        } catch (destroyError) {
          console.log("Failed to delete old course image", destroyError);
        }
      }
    }

    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        creatorId: adminId,
      },
      updateData,
      { new: true },
    );
    if (!course) {
      return res
        .status(404)
        .json({ errors: "can't update, created by other admin" });
    }
    res.status(201).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ errors: "Error in course updating" });
    console.log("Error in course updating ", error);
  }
};

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });
    if (!course) {
      return res
        .status(404)
        .json({ errors: "can't delete, created by other admin" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in course deleting" });
    console.log("Error in course deleting", error);
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(201).json({ courses });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting courses" });
    console.log("error to get courses", error);
  }
};

export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting course details" });
    console.log("Error in course details", error);
  }
};

import Stripe from "stripe";
import config from "../config.js";

const getStripeClient = () => {
  if (!config.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY in backend/.env");
  }

  return new Stripe(config.STRIPE_SECRET_KEY);
};

export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ errors: "User has already purchased this course" });
    }

    // stripe payment code goes here!!
    const amount = course.price;
    const stripe = getStripeClient();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(201).json({
      message: "Course purchased successfully",
      course,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ errors: "Error in course buying" });
    console.log("error in course buying ", error);
  }
};
