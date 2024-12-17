import { useState, useContext } from "react";
import axiosInstance from "./axiosInstance";
import { LocalizationContext } from "../context/LocalizationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const { setLocalization } = useContext(LocalizationContext);

  const login = async ({ username, password, language_id }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
        language_id,
      });

      const data = response.data;
      setUser(data);

      if (data.token) {
        await AsyncStorage.setItem("authToken", data.token);
      }

      if (data.localization) {
        setLocalization(data.localization);
      }

      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setLocalization({});
    await AsyncStorage.removeItem("authToken");
  };

  return { user, loading, error, login, logout };
};

export default useLogin;
