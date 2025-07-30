import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import MovieDetail from "./pages/MovieDetail";
import Watchlist from "./pages/Watchlist"; // ✅ Add this import
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WatchlistProvider } from "./context/WatchlistContext"; // ✅ Context
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WatchlistProvider> {/* ✅ Wrap with context */}
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </WatchlistProvider>
    </BrowserRouter>
  </React.StrictMode>
);
