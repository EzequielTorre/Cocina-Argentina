import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { RecipeProvider } from "./context/RecipeContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { RatingsProvider } from "./context/RatingsContext.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignInUrl="/"
      afterSignUpUrl="/"
      afterSignOutUrl="/"
    >
      {/* Providers envuelven a App */}
      <RecipeProvider>
        <FavoritesProvider>
          <RatingsProvider>
            <App />
          </RatingsProvider>
        </FavoritesProvider>
      </RecipeProvider>
    </ClerkProvider>
  </StrictMode>,
);
