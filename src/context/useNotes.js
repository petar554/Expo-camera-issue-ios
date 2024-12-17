// useNotes.js
import { useState, useCallback } from "react";
import axiosInstance from "../hooks/axiosInstance";

const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching notes...");
      const response = await axiosInstance.get("/users/me/notes");
      console.log("Notes fetched:", response.data);
      const { notes } = response.data;
      setNotes(notes);
      return notes;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to fetch notes";
      console.error("Get Notes Error:", err.response?.data);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
      console.log("Finished fetching notes.");
    }
  }, []);

  const createNote = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Creating a new note...");
      const response = await axiosInstance.post("/notes", {});
      console.log("Note created:", response.data);
      const { notes_id } = response.data;
      return notes_id;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to create note";
      console.error("Create Note Error:", err.response?.data);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
      console.log("Finished creating note.");
    }
  }, []);

  const addImageToNote = useCallback(async (notes_id, imageUri) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Uploading image to note ID: ${notes_id}`);
      console.log("Image URI:", imageUri);

      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: `photo_${Date.now()}.jpg`,
        type: "image/jpeg",
      });

      const response = await axiosInstance.post(
        `/notes/${encodeURIComponent(notes_id)}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Image uploaded:", response.data);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to upload image";
      console.error("Upload Image Error:", err.response?.data || err.message);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
      console.log("Finished uploading image.");
    }
  }, []);

  return {
    notes,
    loading,
    error,
    createNote,
    getNotes,
    addImageToNote,
  };
};

export default useNotes;
