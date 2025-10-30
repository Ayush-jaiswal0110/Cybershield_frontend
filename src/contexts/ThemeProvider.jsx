import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

/**
 * Hook to access theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

/**
 * Theme Provider Component
 * Supports light/dark themes, localStorage persistence,
 * and system preference detection.
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme based on localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;

    // Fallback to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Apply theme to document & persist
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for OS-level theme changes (dynamic sync)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!localStorage.getItem("theme")) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
