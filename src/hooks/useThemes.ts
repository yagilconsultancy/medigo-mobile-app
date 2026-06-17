import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "../context/themeProvider";

export default function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
