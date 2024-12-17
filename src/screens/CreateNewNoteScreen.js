import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert, Dimensions,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useNotesContext } from "../context/NotesContext"; 
import useCreateNote from "../hooks/useCreateNote";
import useMenu from "../hooks/useMenu";
import Menu from "../components/Menu";
import commonStyles, { scale } from "../styles/commonStyles";

const CreateNewNoteScreen = () => {
  const [loading, setLoading] = useState(false);
  const { menuOpen, openMenu, closeMenu } = useMenu();
  const { createNote } = useCreateNote();
  const { setNotesId } = useNotesContext();
  const navigation = useNavigation();

  const handleStart = async () => {
    setLoading(true);
    try {
      const response = await createNote();
      const notesId = response.notes_id;

      setNotesId(notesId);
      navigation.navigate("CameraComponent", { notesId }); 
    } catch (error) {
      console.error("Failed to create a new note:", error);
      Alert.alert("Error", "Failed to create a new note. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.headWrapper}>
        <Text style={commonStyles.h1}>Let's create a new note</Text>
        <Text style={commonStyles.h4}>(it just takes a few seconds)</Text>
      </View>

      <View style={commonStyles.mainWrapper}>
        <Image
          source={require("../../assets/noun-hand-using-phone-4230396.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={commonStyles.h4}>Simply take pictures of your notes</Text>
      </View>

      <View style={commonStyles.buttonContainer}>
        <TouchableOpacity style={[commonStyles.button, styles.customButton]} onPress={handleStart}>
          <Text style={commonStyles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={commonStyles.menuButton} onPress={openMenu}>
          <Image source={require("../../assets/noun-menu.png")} style={commonStyles.menuIcon}/>
        </TouchableOpacity>
      </View>
      <Menu isOpen={menuOpen} onClose={closeMenu} />
    </View>
  );
};

export default CreateNewNoteScreen;

const styles = StyleSheet.create({
  image: {
    width: scale(200),
    height: scale(200),
    marginBottom: scale(20),
  },
  instruction: {
    fontSize: scale(16),
    color: "#6B7280",
    textAlign: "center",
    marginBottom: scale(40),
  },
});
