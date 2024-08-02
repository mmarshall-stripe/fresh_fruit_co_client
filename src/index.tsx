import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import PaymentComplete from "./PaymentComplete";
import { Theme } from "@twilio-paste/core/theme";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "order-status",
    element: <PaymentComplete />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Theme.Provider theme="dark">
    {/* <App /> */}
    <RouterProvider router={router} />
  </Theme.Provider>
);
