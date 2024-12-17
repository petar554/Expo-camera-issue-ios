import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAddImageToNote = () => {
  const addImageToNote = async (notesId, imageUri) => {

    if (!imageUri.startsWith("file://")) {
      throw new Error("Invalid image URI");
    }
    
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: "note_image.jpg",
      type: "image/jpeg",
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    try {
      // const startTime = performance.now();
      const response = await fetch(`${API_URL}/notes/${notesId}/images`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // const endTime = performance.now();
      // console.log(`Image uploaded in ${endTime - startTime}ms`);

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data; // { image_id, thumbnail_image, number_of_images }
    } catch (error) {
        console.error("Error uploading image:", error);
      throw error;
    }
  };

  return { addImageToNote };
};

export default useAddImageToNote;
