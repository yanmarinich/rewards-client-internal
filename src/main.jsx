import React from 'react'

import ReactDOM from "react-dom/client";
import "@app/utils/prototype"
import App from "@app/App";
import "@app/index.css";

const root = document.getElementById("root");
ReactDOM.createRoot(root /*as HTMLElement*/).render(<App />);
