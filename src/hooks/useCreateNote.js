import { useState } from "react";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useCreateNote = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  const createNote = async () => {
    try {
      setLoading(true);
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error("Failed to create note");
      }

      const data = await response.json();
      return data; 
    } catch (err) {
      console.error("Error creating note:", err);
      setError(err.message || "Failed to create note.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createNote, loading, error };
};

export default useCreateNote;
