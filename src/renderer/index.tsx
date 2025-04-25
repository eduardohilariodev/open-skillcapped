import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./styles/bulma.sass"; // Import bulma styles
import * as Sentry from "@sentry/react";
import { GA4React } from "ga-4-react";
import { GA4ReactResolveInterface } from "ga-4-react/dist/models/gtagModels";

// Google Analytics setup
const ga4react = new GA4React("G-JPTQRHF6LZ");
ga4react.initialize().then(
  (ga4: GA4ReactResolveInterface) => {
    ga4.pageview(window.location);
  },
  (err) => {
    console.error(err);
  }
);

// Sentry error tracking setup
Sentry.init({
  dsn: "https://7822525c2ffb4c61a436c1dfdfa14be8@o92742.ingest.sentry.io/5364733",
  // environment: process.env.NODE_ENV,
});

// Render the React app
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
