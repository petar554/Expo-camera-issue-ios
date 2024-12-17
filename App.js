import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext, AuthProvider } from "./src/context/AuthContext";
import { NotesProvider } from "./src/context/NotesContext"; 
import { ThumbnailProvider } from "./src/context/ThumbnailContext";
import LoginScreen from "./src/screens/LoginScreen";
import CreateNewNoteScreen from "./src/screens/CreateNewNoteScreen";
import ReviewCapturedPicturesScreen from "./src/screens/ReviewCapturedPicturesScreen";
import CameraComponent from "./src/components/CameraComponent";
import NotesListScreen from "./src/screens/NotesListScreen";
import { LocalizationProvider } from "./src/context/LocalizationContext";


const Stack = createStackNavigator();

const AppNavigator = () => {
  const { authToken } = useContext(AuthContext);

  return (
    <LocalizationProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {authToken ? (
            <>
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="CreateNewNoteScreen" component={CreateNewNoteScreen} />
              <Stack.Screen name="CameraComponent" component={CameraComponent} />
              <Stack.Screen name="ReviewCapturedPicturesScreen" component={ReviewCapturedPicturesScreen}/>
              <Stack.Screen name="NotesListScreen" component={NotesListScreen} />
              {/* Other authenticated screens */}
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              {/* Other unauthenticated screens */}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </LocalizationProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <ThumbnailProvider>
          <AppNavigator />
        </ThumbnailProvider>
      </NotesProvider>
    </AuthProvider>
  );
}
