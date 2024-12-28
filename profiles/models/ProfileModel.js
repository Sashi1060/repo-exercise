import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true, // Removes extra spaces
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // Ensures the email is stored in lowercase
        match: [/.+@.+\..+/, "Please enter a valid email address"], // Email validation
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"], // Mobile validation
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    academicDetails: {
        type: Object,
        required: true,
        default: {}, // Ensures the field always has an object
    },
    experience: {
        type: Object,
        required: true,
        default: {},
    },
    skills: {
        type: [String], // Array of strings
        required: true,
        default: [],
    },
    projects: {
        type: Object,
        required: true,
        default: {},
    },
    social: {
        type: Object,
        required: true,
        default: {},
    },
    resume: {
        type: String,
        required: true,
        trim: true, // Ensures no extra spaces
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the Profile model
const ProfileModel = mongoose.model("Profile", ProfileSchema);

export default ProfileModel;
