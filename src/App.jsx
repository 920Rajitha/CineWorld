import SearchMovies from "./pages/SearchMovies";
import { Clapperboard, Heart } from "lucide-react";
import { useWatchlist } from "./context/WatchlistContext";
import { useNavigate } from "react-router-dom";
import MovieSlider from "./components/MovieSlider"; // ✅ Import the reusable slider

export default function App() {
  const { watchlist } = useWatchlist();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
      {/* Header / Navbar */}
      <header className="text-center pt-16 pb-8 relative">
        <div className="flex justify-center items-center gap-3 mb-4 animate-fade-in">
          <Clapperboard size={42} className="text-purple-400 drop-shadow-lg" />
          <h1 className="text-5xl font-extrabold tracking-tight">CineWorld</h1>
        </div>

        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Dive into the cinematic universe 🎥 — Search, Explore, and Watch trailers of your favorite movies.
        </p>

        {/* Watchlist Shortcut */}
        <button
          onClick={() => navigate("/watchlist")}
          className="absolute top-4 right-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 transition duration-200 shadow-md"
        >
          <Heart size={16} />
          Watchlist ({watchlist.length})
        </button>
      </header>

      {/* Main Search Section */}
      <main className="flex flex-col items-center mt-6 px-4">
        <SearchMovies />

        {/* Movie Sliders */}
        <MovieSlider
          title="🔥 Now Playing"
          apiUrl="https://api.themoviedb.org/3/movie/now_playing?api_key=ae22899043ac52c1eff3dde13c032381"
        />
        <MovieSlider
          title="📅 Upcoming Movies"
          apiUrl="https://api.themoviedb.org/3/movie/upcoming?api_key=ae22899043ac52c1eff3dde13c032381"
        />

<MovieSlider
  title="🔥 Now Playing"
  apiUrl="https://api.themoviedb.org/3/movie/now_playing?api_key=ae22899043ac52c1eff3dde13c032381"
  badge="NEW"
/>

<MovieSlider
  title="🚀 Popular Picks"
  apiUrl="https://api.themoviedb.org/3/movie/popular?api_key=ae22899043ac52c1eff3dde13c032381"
  badge="TOP"
/>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-400 pb-6">
        © 2025 <span className="text-purple-300 font-semibold">CineWorld</span>. Made with ❤️ for movie lovers.
      </footer>
    </div>
  );
}
