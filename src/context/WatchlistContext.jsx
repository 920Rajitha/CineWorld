import { createContext, useContext, useEffect, useState } from "react";

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("cine_watchlist");
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cine_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (movie) => {
    const exists = watchlist.find((m) => m.id === movie.id);
    if (exists) {
      setWatchlist(watchlist.filter((m) => m.id !== movie.id));
    } else {
      setWatchlist([...watchlist, movie]);
    }
  };

  const isInWatchlist = (id) => watchlist.some((m) => m.id === id);

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
