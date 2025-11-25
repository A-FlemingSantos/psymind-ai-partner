import { Toaster } from "./shared/components/ui/toaster";
import { Toaster as Sonner } from "./shared/components/ui/sonner";
import { TooltipProvider } from "./shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./features/settings";
import { PomodoroProvider } from "./features/tools/PomodoroContext";
import Index from "./pages/Index";
import { Login, Register } from "./features/auth";
import NotFound from "./pages/NotFound";
import { Workspace } from "./features/workspace";
import { Calendar } from "./features/calendar";
import { Editor } from "./features/editor";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SettingsProvider>
        <PomodoroProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <main id="main-content" role="main" aria-label="Conteúdo principal">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/workspace" element={<Workspace />} />
              <Route path="/calendar" element={<Calendar />} />
              {/* New Route for Editor */}
              <Route path="/editor" element={<Editor />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </BrowserRouter>
        </PomodoroProvider>
      </SettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;