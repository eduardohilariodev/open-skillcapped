import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./bulma.sass";
import * as Sentry from "@sentry/react";
import ReactGA4 from "react-ga4";

// Initialize Google Analytics 4 with a more reliable library
try {
  ReactGA4.initialize("G-JPTQRHF6LZ");
  ReactGA4.send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
  });
} catch (error) {
  console.warn("Failed to initialize Google Analytics:", error);
}

Sentry.init({
  dsn: "https://7822525c2ffb4c61a436c1dfdfa14be8@o92742.ingest.sentry.io/5364733",
  // release: process.env.REACT_APP_TRAVIS_COMMIT,
  // environment: process.env.NODE_ENV,
});

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
