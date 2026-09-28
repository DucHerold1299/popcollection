import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/dreamy.css";
import { LOGIN_BG } from "./lib/wallpapers";
import { applyWallpaperTheme } from "./lib/theme";
import { LOGO_IMAGE, setAppIcon } from "./lib/logo";

// Match all colors to the wallpaper picked for this visit, and use this visit's logo as the icon.
applyWallpaperTheme(LOGIN_BG);
setAppIcon(LOGO_IMAGE);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
