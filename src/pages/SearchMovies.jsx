import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SearchMovies() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/movies/search/${query}`);
      setResults(res.data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-[#1a1a2e] rounded-2xl p-6 shadow-xl border border-purple-700/50">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="🔍 Search movies (e.g. Avengers)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-2 text-black rounded-l-lg focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 font-semibold rounded-r-lg shadow"
        >
          Search
        </button>
      </div>

      {/* Movie Results Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {results.map((movie) => (
          <div
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="cursor-pointer bg-[#202040] rounded-lg overflow-hidden shadow-md hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={movie.title}
              className="w-full h-[320px] object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{movie.title}</h3>
              <p className="text-sm text-gray-400">{movie.release_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
