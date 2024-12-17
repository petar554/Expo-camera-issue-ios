import { Alert } from "react-native";

/**
 * A utility function to handle errors and display an alert.
 * @param {string} message - The error message to display.
 * @param {Error} [error] - Optional error object for logging purposes.
 */
export const handleError = (message: string, error?: Error): void => {
  if (error) {
    console.error(error);
  }

  Alert.alert("Error", message);
};
