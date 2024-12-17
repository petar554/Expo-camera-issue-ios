import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useNotesGeneration = () => {
    const startProcessingNotes = async (notesId) => {
        const response = await fetch(`${API_URL}/notes/${notesId}/process`, {
            method: "POST",
            headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
            },
        });
        
        if (!response.ok) {
            throw new Error("Failed to start processing notes.");
        }
        
        return await response.json(); 
    };
    
    const getNoteDetails = async (notesId) => {
        const response = await fetch(`${API_URL}/notes/${notesId}`, {
            method: "GET",
            headers: {
              	Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
            },
        });
        
        if (!response.ok) {
            throw new Error("Failed to retrieve note details.");
        }
        
        return await response.json(); 
    };

    const startTest = async (notesId) => {
        const response = await fetch(`${API_URL}/tests`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes_id: notesId }),
        });
      
        if (!response.ok) {
          throw new Error("Failed to start the test.");
        }
      
        const data = await response.json();
        return data;
      };
     
    return { startProcessingNotes, getNoteDetails, startTest };
}

export default useNotesGeneration;
