import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FirebaseProvider } from "./firebase/firebase.config";

// axios.interceptors.request.use(function (config) {
//   // config means configuration object
//   const token = localStorage.getItem("token");
//   config.headers["x-access-token"] = token;

//   return config; // The modified request configuration object (`config`) is returned.
// });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <FirebaseProvider>
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose="2000" />
      <App />
    </BrowserRouter>
  </FirebaseProvider>
);
