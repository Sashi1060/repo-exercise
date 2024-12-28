import express from "express";
import jwt from "jsonwebtoken";
import ProfileModel from "../models/ProfileModel.js";
import { fetchUserEmail } from "../api/userService.js";

const router = express.Router();

// Middleware to authenticate and extract user details from token
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.error("Authorization token missing");
        return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Log decoded token
        req.user = decoded; // Attach user details to the request object
        next();
    } catch (error) {
        console.error("Invalid or expired token:", error.message); // Log token error
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

router.post("/", authenticateToken, async (req, res) => {
    const { fullname, mobile, address, academicDetails, experience, skills, projects, social, resume } = req.body;
    const userId = req.user.sub; // Extract user ID from token
    console.log("Extracted user ID from token:", userId); // Log user ID

    try {
        // Fetch email using user ID
        const email = await fetchUserEmail(userId);
        console.log("Fetched email for user ID:", email); // Log fetched email

        // Check if a profile already exists for the user
        const existingProfile = await ProfileModel.findOne({ email });
        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists" });
        }

        // Create and save the new profile
        const profile = new ProfileModel({
            fullname,
            email, // Fetched email
            mobile,
            address,
            academicDetails,
            experience,
            skills,
            projects,
            social,
            resume,
        });

        console.log("Saving new profile:", profile); // Log profile before saving
        await profile.save();
        console.log("Profile created successfully for email:", email); // Log success
        res.status(201).json({ message: "Profile created successfully", profile });
    } catch (error) {
        console.error("Error creating profile:", error.message); // Log error details
        res.status(500).json({ message: "Error creating profile", error: error.message });
    }
});

export default router;