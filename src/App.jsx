import { ThemeProvider, CssBaseline } from "@mui/material";
import { useMemo, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import { getTheme } from "./theme/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Inspector } from "react-dev-inspector";

function App() {
  const [mode, setMode] = useState(localStorage.getItem("theme") || "light");

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Inspector>
        <AppRoutes toggleTheme={toggleTheme} mode={mode} />
      </Inspector>
    </ThemeProvider>
  );
}

export default App;
