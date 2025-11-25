import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./shared/styles/globals.css";
import { ChatProvider } from "@/features/chat";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <ChatProvider>
      <App />
    </ChatProvider>
  </ThemeProvider>
);