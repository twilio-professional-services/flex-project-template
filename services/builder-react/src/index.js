import React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./components/TranslatableText.builder";
import "./components/ProductGrid/ProductGrid.builder";
import "./components/StorePhone/StorePhone.builder";
import "./components/CoreButton/CoreButton.builder";
import "./components/Cart/CartButton/CartButton.builder"
import "./components/UserAvatar/UserAvatar.builder"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// To use service workers, uncomment the line below. Be sure before doing so
// to understand additional deloyment configuration this might require
// here https://facebook.github.io/create-react-app/docs/deployment
// serviceWorker.unregister();

// If you want your app to work offline and load faster, you can change
// unregister() to register() above. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
