import express from "express";
import dotenv from "dotenv";
import { connectionStatus } from "./config/databaseConnection.js";
import profileRoutes from "./views&urls/profileRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));

// Routes
app.use("/profiles", profileRoutes);

(async () => {
    await connectionStatus(); // Establish MongoDB connection
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
