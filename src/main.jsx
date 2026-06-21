import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Pas de <React.StrictMode> : en dev il monte chaque écran deux fois, ce qui
// fait prononcer le mot deux fois (les écrans parlent dans un effet de montage).
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
