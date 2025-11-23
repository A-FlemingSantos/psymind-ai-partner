import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChatProvider } from "@/context/ChatContext";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <ChatProvider>
      <App />
    </ChatProvider>
  </ThemeProvider>
);