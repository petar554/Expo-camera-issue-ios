import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, View, Image, Alert, Text } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { StackNavigationProp } from '@react-navigation/stack';

import { useThumbnail } from "../context/ThumbnailContext";
import useAddImageToNote from '../hooks/useAddImageToNote'; 
import { handleError } from "../utils/errorHandler"; 
import Menu from "../components/Menu"; 
import commonStyles, { scale } from "../styles/commonStyles";
import CameraIcon from '../../assets/camera.png';
import MenuIcon from '../../assets/noun-menu.png';

const { height } = Dimensions.get('window');

type RootStackParamList = {
  ReviewCapturedPicturesScreen: { notesId: string };
  MenuScreen: undefined;
};
type CameraNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ReviewCapturedPicturesScreen'
>;
type CameraComponentRouteParams = {
  notesId: string;
};
type CameraComponentRouteProp = RouteProp<{ CameraComponent: CameraComponentRouteParams }, 'CameraComponent'>;

export default function CameraComponent() {
  const route = useRoute<CameraComponentRouteProp>();
  const navigation = useNavigation<CameraNavigationProp>();

  const { thumbnail, setThumbnail, imageCount, setImageCount, nextImageId, setNextImageId } = useThumbnail();

  // get notesId from route params, with a fallback
  const notesId = route.params?.notesId ?? '';
  if (!notesId) {
    Alert.alert('Error', 'No notes ID provided.');
    navigation.goBack(); // navigate back if no notesId
  }

  // component states
  const [cameraType, setCameraType] = useState<CameraType>('back');
  // const [thumbnail, setThumbnail] = useState<string | null>(null);
  // const [imageCount, setImageCount] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const { addImageToNote } = useAddImageToNote();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // request camera permissions on mount
  useEffect(() => {
    (async () => {
      const [permission] = await useCameraPermissions();
      setHasPermission(permission?.status === 'granted');
    })();
  }, []);

  // #todo
  useEffect(() => {
    const adjustPadding = setTimeout(() => {
      setPaddingBottom(height * 0.2); 
    }, 100);
  
    return () => clearTimeout(adjustPadding);
  }, []);

  // menu handlers
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // capture a photo
  const capturePhoto = async () => {
    if (!cameraRef.current) return null;
    try {
      // average time to capture photo:  692.66ms
      //const startTime = performance.now(); // Start timing
      const photo = await cameraRef.current.takePictureAsync();
      console.log(`Captured Image Dimensions: Width=${photo.width}, Height=${photo.height}`); // dimensions: Width=1080, Height=1440
      //const endTime = performance.now(); 
      //console.log(`Photo captured in ${endTime - startTime}ms`);

      return photo?.uri || null;
    } catch (error) {
      handleError('Failed to capture image.');
      return null;
    }
  };

  // upload a photo
  const uploadPhoto = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log(`Captured Image Size: ${blob.size} bytes`);  // captured Image Size: 732448 bytes

      // const resizedImage = await ImageResizer.createResizedImage(
      //   uri,        // image URI
      //   800,        // max width (adjust based on desired quality)
      //   800,        // max height (adjust based on desired quality)
      //   'JPEG',     // qutput format
      //   80          // quality (0-100)
      // );

      // const compressedImage = await CompressedImage.compress(uri, {
      //   compressionMethod: 'auto',
      //   maxWidth: 800, // Adjust as needed
      //   maxHeight: 800, // Adjust as needed
      //   quality: 0.8,   // Adjust quality (0-1)
      // });

      const startTime = performance.now();
      const result = await addImageToNote(notesId, uri);
      const endTime = performance.now();
      console.log(`Photo uploaded in ${endTime - startTime}ms`); // latest photo uploaded in 3579.066770017147ms

      setThumbnail(`data:image/jpeg;base64,${result.thumbnail_image}`);
      setImageCount(result.number_of_images);
      setNextImageId(result.image_id);
    } catch {
      handleError('Failed to upload image. Please try again.');
    }
  };

  const handleCapture = async () => {
    setIsProcessing(true);

    const uri = await capturePhoto();
    if (uri) {
      try {
        await uploadPhoto(uri);
      } catch (error) {
        console.error("Error during photo upload:", error);
        Alert.alert("Error", "e: Failed to upload image. Please try again.");
      }
    }
  
    setIsProcessing(false);
  };

  // navigate to ReviewCapturedPicturesScreen
  const handleThumbnailPress = () => {
    if (!notesId) {
      handleError('No notes ID available.');
      return;
    }
    navigation.navigate('ReviewCapturedPicturesScreen', { notesId });
  };

  // if camera permissions are denied
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access is required.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom }]}>
      <CameraView
        style={styles.camera}
        facing={cameraType}
        ref={(ref) => (cameraRef.current = ref)}
        onCameraReady={() => console.log('Camera is ready')}
      />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.cameraButtonCircle} onPress={handleCapture} disabled={isProcessing}>
          <Image source={CameraIcon} style={styles.cameraIcon} />
        </TouchableOpacity>
        {thumbnail && (
          <TouchableOpacity style={styles.thumbnailContainer} onPress={handleThumbnailPress}>
            <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
            <Text style={styles.imageCount}>{imageCount}</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
        <Image source={MenuIcon} style={styles.menuIcon} />
      </TouchableOpacity>
      <Menu isOpen={menuOpen} onClose={closeMenu} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: height * 0.2,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  cameraButtonCircle: {
    backgroundColor: '#000',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 40,
    height: 40,
    tintColor: '#FFFFFF',
  },
  thumbnailContainer: {
    position: 'absolute',
    left: 20,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  imageCount: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#1F2937',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 6,
    fontSize: 12,
  },
  menuButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    borderRadius: scale(50),
    backgroundColor: 'rgba(255, 255, 255, 0)',
    padding: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  menuIcon: {
    width: 35,
    height: 35,
    tintColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
});
