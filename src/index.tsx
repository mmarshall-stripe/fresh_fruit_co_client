import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Theme } from "@twilio-paste/core/theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Theme.Provider theme="dark">
    <App />
  </Theme.Provider>
);
