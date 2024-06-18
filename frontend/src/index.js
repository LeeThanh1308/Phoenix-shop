import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalStyles from "./components/GlobalStyles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginedProvider from "./hooks/useContext/LoginedContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GlobalStyles>
    <LoginedProvider>
      <App />
    </LoginedProvider>
    <ToastContainer className={" mt-16"} />
  </GlobalStyles>
);
