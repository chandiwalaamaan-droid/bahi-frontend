import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { TermsPage, PrivacyPage } from "./pages/LegalPages.jsx";

// Bahi is a single-page app with no router dependency. /terms and /privacy
// are the only two routes that need to exist as real, linkable, shareable
// URLs (so they render as static pages here rather than in-app modals).
// netlify.toml already rewrites all paths to /index.html, so this is the
// only piece needed to make those URLs work in production too.
function Root() {
  const path = window.location.pathname;
  if (path === "/terms") return <TermsPage />;
  if (path === "/privacy") return <PrivacyPage />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
