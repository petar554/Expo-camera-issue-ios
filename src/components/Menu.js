import React, { useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { LocalizationContext } from "../context/LocalizationContext";

const { width } = Dimensions.get("window");
const MENU_WIDTH = width; // Full screen width

const Menu = ({ isOpen, onClose }) => {
  const { localization } = useContext(LocalizationContext);
  const navigation = useNavigation();

  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -MENU_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, slideAnim]);

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          accessibilityLabel="Close Menu"
        >
          <Icon name="times" size={24} color="#4B5563" />
        </TouchableOpacity>

        {/* Navigation Links */}
        <View style={styles.navLinks}>
          {/* Notes Link */}
          <TouchableOpacity
            style={styles.link}
            onPress={() => handleNavigation("NotesListScreen")}
          >
            <Text style={styles.linkText}>notes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => handleNavigation("LoginScreen")}
          >
            <Text style={styles.linkText}>setup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => handleNavigation("LoginScreen")}
          >
            <Text style={styles.linkText}>account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => handleNavigation("LoginScreen")}
          >
            <Text style={styles.linkText}>logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

export default Menu;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 49,
  },
  menuContainer: {
    ...StyleSheet.absoluteFillObject, // Ensures the container fills the screen
    backgroundColor: "#FFFFFF",
    zIndex: 50,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 10,
    padding: 10,
  },
  navLinks: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    marginVertical: 15,
    alignSelf: "center",
  },
  linkText: {
    fontSize: 24,
    color: "#4B5563",
    fontWeight: "bold",
  },
  logoutText: {
    fontSize: 24,
    color: "#DC2626",
    fontWeight: "bold",
  },
});