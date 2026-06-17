import React, { createContext, useState, useEffect, ReactNode } from "react";
import { lightColors, darkColors, ColorsType } from "../theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = "light" | "dark";

export interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => Promise<void>;
  colors: ColorsType;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: async () => {},
  colors: lightColors,
});

interface Props {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<ThemeType>("light");

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("appTheme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("appTheme", newTheme);
  };

  const colors: ColorsType = theme === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}
