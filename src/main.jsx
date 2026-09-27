import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { LOGIN_BG } from "./lib/wallpapers";
import { applyWallpaperTheme } from "./lib/theme";

// Match all colors to the wallpaper picked for this visit.
applyWallpaperTheme(LOGIN_BG);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
