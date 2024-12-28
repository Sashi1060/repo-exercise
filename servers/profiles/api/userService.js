import axios from 'axios';


const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4000';

export async function fetchUserEmail(userId) {
    try {
        const response = await axios.get(`${USER_SERVICE_URL}/users/users/${userId}`);
        return response.data.email; // Assuming the User Service now returns user details
    } catch (error) {
        console.error(`Failed to fetch user details for ID ${userId}:`, error.message);
        throw new Error("Unable to fetch user details.");
    }
}