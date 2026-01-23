import { ThemeProvider, CssBaseline } from "@mui/material";
import { useMemo, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import { getTheme } from "./theme/theme";

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
      <AppRoutes toggleTheme={toggleTheme} mode={mode} />
    </ThemeProvider>
  );
}

export default App;
