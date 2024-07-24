import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./scss/index.scss";
import { DataProvider } from "./context/data-context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<DataProvider>
			<App />
		</DataProvider>
	</React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
	console.log(message);
});
