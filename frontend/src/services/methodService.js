import axios from "axios";

const apiUrl = "http://yourapiurl.com/methods"; // Replace with your actual API endpoint

// Add a new method
export const addMethod = async (methodData) => {
  try {
    const response = await axios.post(apiUrl, methodData);
    return response.data;
  } catch (error) {
    console.error("Error adding method:", error);
    throw error;
  }
};

// Fetch all methods
export const getMethods = async () => {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching methods:", error);
    throw error;
  }
};

// Update a method
export const updateMethod = async (methodId, updatedData) => {
  try {
    const response = await axios.put(`${apiUrl}/${methodId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating method:", error);
    throw error;
  }
};

// Delete a method
export const deleteMethod = async (methodId) => {
  try {
    const response = await axios.delete(`${apiUrl}/${methodId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting method:", error);
    throw error;
  }
};
