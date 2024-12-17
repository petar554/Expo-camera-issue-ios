import React, { useState, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import useGetUserNotes from "../hooks/useGetUserNotes";
import useMenu from "../hooks/useMenu";
import Menu from "../components/Menu";
import commonStyles, { scale } from "../styles/commonStyles";

const NotesListScreen = () => {
  const { notes, loading, error, fetchUserNotes } = useGetUserNotes();
  const { menuOpen, openMenu, closeMenu } = useMenu();
  const navigation = useNavigation();

  const handleNoteClick = (note) => {
    navigation.navigate("NotesSummaryScreen", { notesId: note.notes_id });
  };

  const handleCreateNote = () => {
    navigation.navigate("CreateNewNoteScreen");
  };

  // refresh notes when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUserNotes();
    }, [fetchUserNotes])
  );

  if (loading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={commonStyles.errorContainer}>
        <Text style={commonStyles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[commonStyles.h3, styles.customH3]}>NOTES TO STUDY</Text>

      <ScrollView>
        {notes.length > 0 ? (
          notes.map((note) => {
            if (note.notes_id) {
              return (
                <TouchableOpacity
                  key={note.notes_id}
                  style={styles.noteCard}
                  onPress={() => handleNoteClick(note)}
                >
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${note.thumbnail_image}` }}
                    style={styles.thumbnail}
                  />
                  <View style={styles.noteInfo}>
                    <Text style={styles.noteSubject}>{note.subject}</Text>
                    <Text style={styles.noteTitle}>{note.name}</Text>
                  </View>
                </TouchableOpacity>
              );
            }
            return null;
          })
        ) : (
          <Text style={commonStyles.h4}>No notes available.</Text>
        )}
      </ScrollView>

      <View style={[commonStyles.buttonContainer, styles.customButtonContainer]}>
        <TouchableOpacity style={commonStyles.button} onPress={handleCreateNote}>
          <Text style={commonStyles.buttonText}>Create notes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={commonStyles.menuButton} onPress={openMenu}>
          <Image source={require("../../assets/noun-menu.png")} style={commonStyles.menuIcon} />
        </TouchableOpacity>
      </View>

      <Menu isOpen={menuOpen} onClose={closeMenu} />
    </View>
  );
};

export default NotesListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: scale(400),
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingTop: scale(80),
    backgroundColor: "#F3F4F6",
  },
  noteCard: {
    width: "100%",
    height: scale(120),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dedede",
    borderRadius: scale(8),
    marginBottom: scale(15),
    padding: scale(10),
  },
  thumbnail: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(8),
    marginRight: scale(12),
  },
  noteInfo: {
    justifyContent: "center",
    flexShrink: 1,
    height: "100%", 
  },
  noteSubject: {
    fontSize: scale(20),
    color: "#6B7280",
  },
  noteTitle: {
    flexShrink: 1,
    fontSize: scale(14),
    fontWeight: "600",
    color: "#1F2937",
  },
  // Custom styles
  customButtonContainer: {
    marginTop: scale(20),
  },
  customH3: {
    marginTop: scale(20),
    marginBottom: scale(10),
  },
});
