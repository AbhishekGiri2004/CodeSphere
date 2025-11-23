
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { EditorContextProvider } from "./contexts/EditorContext";
import { CollaborationContextProvider } from "./contexts/CollaborationContext";
import { UserContextProvider } from "./contexts/UserContext";
import Index from "./pages/Index";
import Room from "./pages/Room";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserContextProvider>
          <CollaborationContextProvider>
            <EditorContextProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/room/:roomId" element={<Room />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </EditorContextProvider>
          </CollaborationContextProvider>
        </UserContextProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
