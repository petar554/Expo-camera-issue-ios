import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useGetThumbnails = () => {
  const getThumbnails = async (notesId) => {
    const response = await fetch(`${API_URL}/notes/${notesId}/thumbnails`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch thumbnails");
    }

    const data = await response.json();
    return data; // { thumbnails: [{ image_id, thumbnail_image }], number_of_images }
  };

  const getFullImage = async (imageId) => {
    const response = await fetch(`${API_URL}/images/${imageId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch full image");
    }

    const blob = await response.blob();

    // convert blob to base64 using FileReader
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result); // base64 string
        reader.onerror = reject;
        reader.readAsDataURL(blob); // read blob as base64 data URL
    });
  };

  const deleteImage = async (imageId) => {
    const response = await fetch(`${API_URL}/images/${imageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to delete the image");
    }
  };

  return { getThumbnails, getFullImage, deleteImage };
};

export default useGetThumbnails;
