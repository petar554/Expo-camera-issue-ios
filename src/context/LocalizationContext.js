// LocalizationContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LocalizationContext = createContext();

export const LocalizationProvider = ({ children }) => {
  const [localization, setLocalization] = useState({});

  useEffect(() => {
    const loadLocalization = async () => {
      const storedLocalization = await AsyncStorage.getItem("localization");
      if (storedLocalization) {
        try {
          const parsedLocalization = JSON.parse(storedLocalization);
          setLocalization(parsedLocalization);
          console.log(
            "Loaded localization from AsyncStorage:",
            parsedLocalization
          );
        } catch (error) {
          console.error(
            "Failed to parse localization data from AsyncStorage:",
            error
          );
          await AsyncStorage.removeItem("localization");
        }
      } else {
        console.log("No localization data found in AsyncStorage.");
      }
    };
    loadLocalization();
  }, []);

  useEffect(() => {
    const saveLocalization = async () => {
      if (Object.keys(localization).length > 0) {
        await AsyncStorage.setItem(
          "localization",
          JSON.stringify(localization)
        );
        console.log("Updated localization in AsyncStorage:", localization);
      }
    };
    saveLocalization();
  }, [localization]);

  return (
    <LocalizationContext.Provider value={{ localization, setLocalization }}>
      {children}
    </LocalizationContext.Provider>
  );
};
