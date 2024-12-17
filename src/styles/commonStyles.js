import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export const scale = (size) => (width / 375) * size;

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: scale(400),
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingTop: scale(80),
    backgroundColor: "#F3F4F6",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative", 
    width: "100%", 
    marginBottom: scale(30),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  mainWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", 
  },
  headWrapper: {
    paddingTop: scale(50),
    alignItems: "center",    
  },

  errorText: {
    marginBottom: scale(10),
    color: "#DC2626",
    textAlign: "center",
    fontSize: scale(14),
  },

  h1: {
    fontSize: scale(34),
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: scale(10),
  },
  h2: {
    fontSize: scale(28),
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: scale(10),
  },
  h3: {
    fontSize: scale(21),
    fontWeight: "400",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: scale(10),
  },
  h4: {
    fontSize: scale(13),
    fontWeight: "400",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: scale(10),
  },
  h5: {
    fontSize: scale(10),
    fontWeight: "400",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: scale(10),
  },
  button: {
    width: "50%",
    height: scale(50),
    paddingVertical: scale(6),
    paddingHorizontal: scale(6),
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: scale(50),
    borderWidth: 1,
  },
  cameraButton: {
    width: scale(52),
    height: scale(52),
    borderRadius: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton: {
    position: "absolute",
    right: scale(10),
  },
  buttonText: {
    color: "black",
    fontWeight: "600",
    fontSize: scale(14),
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  
  cameraIcon: {
    width: 42,
    height: 42,
    tintColor: "#FFFFFF",
  },
  menuIcon: {
    width: scale(35),
    height: scale(35),
    tintColor: "#1F2937",
  },
});

export default commonStyles;
