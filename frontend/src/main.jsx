import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51RGDtX61B1XgRIaA5T7ZYtVlkSrTrCPul3HcefIqK36zP4ZaSjEy9nyAUePl6NvpPnT6EHUpOdTzbF3sLAVgpyr000Hw52y2kF"
);

createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
