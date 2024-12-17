import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";

import { useThumbnail } from "../context/ThumbnailContext";
import useGetThumbnails from "../hooks/useGetThumbnails";
import useNotesGeneration from "../hooks/useNotesGeneration";
import useMenu from "../hooks/useMenu";
import Menu from "../components/Menu";
import commonStyles, { scale } from "../styles/commonStyles";
import CameraIcon from "../../assets/camera.png";
import DeleteIcon from "../../assets/delete.png";

const { height, width } = Dimensions.get("window");

const ReviewCapturedPicturesScreen = ({ route, navigation }) => {
  const { notesId } = route.params;
  const { getThumbnails, getFullImage, deleteImage } = useGetThumbnails();
  const { startProcessingNotes } = useNotesGeneration();
  const { menuOpen, openMenu, closeMenu } = useMenu();
  const { imageCount, setImageCount, nextImageId, setNextImageId, thumbnail, setThumbnail } = useThumbnail();

  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fullImages, setFullImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);


  // fetch thumbnails and full images
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await getThumbnails(notesId);
  
        const images = await Promise.all(
          response.thumbnails.map((thumbnail) => getFullImage(thumbnail.image_id))
        );

        setThumbnails(response.thumbnails);
        setImageCount(response.thumbnails.length);
        setFullImages(images);

      } catch (error) {
        Alert.alert("Error", "Failed to retrieve images. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [notesId]);

  const handleThumbnailPress = async (thumbnailIndex) => {
    try {
      // update activeIndex for slider position
      setActiveIndex(thumbnailIndex);
  
      // scroll to the corresponding image in the slider
      if (sliderRef.current) {
        sliderRef.current.scrollTo({
          x: thumbnailIndex * width,
          animated: true,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load image. Please try again.");
    }
  };

  const handleDeleteImage = async (imageId) => {
    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteImage(imageId);
  
            // filter out the deleted thumbnail and fullImages
            const updatedThumbnails = thumbnails.filter(
              (thumbnail) => thumbnail.image_id !== imageId
            );
            setThumbnails(updatedThumbnails);
            setImageCount(updatedThumbnails.length);

            const updatedFullImages = fullImages.filter((_, index) =>
              thumbnails[index].image_id !== imageId
            );
            setFullImages(updatedFullImages);

            // determine the next active index
            if (updatedFullImages.length > 0) {
              const newIndex =
                activeIndex >= updatedFullImages.length
                  ? updatedFullImages.length - 1
                  : activeIndex;
              setActiveIndex(newIndex);
  
              // scroll the slider to the new active index
              if (sliderRef.current) {
                sliderRef.current.scrollTo({
                  x: newIndex * width,
                  animated: true,
                });
              }
            } else {
              setActiveIndex(0);
              setImageCount(0);
              setThumbnails([]);
              setThumbnail(null);
            }
          } catch (error) {
            Alert.alert("Error", "Failed to delete the image. Please try again.");
          }
        },
        style: "destructive",
      },
    ]);
  };
  
  const handleGenerateNotes = async () => {
    try {
      const response = await startProcessingNotes(notesId);
      if (response.status === "Processing started.") {
        navigation.navigate("GeneratingNotesScreen", { notesId });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to start note processing. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* image slider */}
      <ScrollView
        ref={sliderRef} // attach the ref here
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        style={styles.fullImageContainer}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(newIndex); // update active index on scroll
        }}
      >
        {fullImages.map((uri, index) => (
          <View key={index} style={styles.fullImageWrapper}>
            <Image source={{ uri }} style={styles.fullImage} />
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => handleDeleteImage(thumbnails[index].image_id)}
            >
              <Image source={DeleteIcon} style={styles.deleteIconImage} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* thumbnails */}
      <ScrollView horizontal contentContainerStyle={styles.thumbnailContainer}>
        {thumbnails.map((thumbnail, index) => (
          <TouchableOpacity
            key={thumbnail.image_id}
            style={styles.thumbnailWrapper}
            onPress={() => handleThumbnailPress(index)}
          >
            <Image
              source={{
                uri: `data:image/jpeg;base64,${thumbnail.thumbnail_image}`,
              }}
              style={styles.thumbnail}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.customCameraButton}
          onPress={() => navigation.navigate("CameraComponent", { notesId })}
        >
          <Image source={CameraIcon} style={styles.customCameraIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={commonStyles.button} onPress={handleGenerateNotes}>
          <Text style={commonStyles.buttonText}>Generate Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.customMenuButton]} onPress={openMenu}>
          <Image source={require("../../assets/noun-menu.png")} style={commonStyles.menuIcon} />
        </TouchableOpacity>
      </View>
      <Menu isOpen={menuOpen} onClose={closeMenu} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
  },
  thumbnailContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  thumbnailWrapper: {
    marginHorizontal: 5,
    paddingTop: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  deleteIcon: {
    position: "absolute",
    bottom: 10,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 5,
    zIndex: 1,
  },
  deleteIconImage: {
    width: scale(23),
    height: scale(23),
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "auto",
    marginBottom: scale(25),
    padding: scale(16),
    gap: scale(30),
  },
  fullImageContainer: {
    width: "100%",
  },
  fullImage: {
    width: width,
    height: height * 0.79,
    resizeMode: "cover",
    marginHorizontal: 0,
  },
  fullImageWrapper: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  // custom styles
  customMenuButton: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(50),
    alignItems: "flex-end",
    justifyContent: "center",
  },
  customCameraButton: {
    width: scale(52),
    height: scale(52),
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  customCameraIcon: {
    width: 42,
    height: 42,
    tintColor: "#000",
  },
});

export default ReviewCapturedPicturesScreen;
