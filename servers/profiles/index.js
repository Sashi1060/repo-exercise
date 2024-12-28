import express from "express";
import dotenv from "dotenv";
import { connectionStatus } from "./config/databaseConnection.js";
import profileRoutes from "./views&urls/profileRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/profiles", profileRoutes);

(async () => {
    await connectionStatus(); // Establish MongoDB connection
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
