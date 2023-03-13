import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { EditorProvider } from "./lib/EditorContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <EditorProvider>
      <App />
    </EditorProvider>
  </React.StrictMode>
);
