import { useWatchlist } from "../context/WatchlistContext";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, Play, Star, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

export default function Watchlist() {
  const { watchlist, toggleWatchlist } = useWatchlist();
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [sortBy, setSortBy] = useState("added"); // 'added', 'year', 'rating'

  useEffect(() => {
    // Create a copy of watchlist to sort
    const sortedMovies = [...watchlist];
    
    switch(sortBy) {
      case 'year':
        sortedMovies.sort((a, b) => 
          new Date(b.release_date) - new Date(a.release_date));
        break;
      case 'rating':
        // Note: You would need to fetch ratings or store them in your watchlist context
        // This is just a placeholder implementation
        sortedMovies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        break;
      default:
        // Default is by added order (no sorting needed)
        break;
    }
    
    setFilteredMovies(sortedMovies);
  }, [watchlist, sortBy]);

  const handleRemove = (movie) => {
    setIsRemoving(true);
    toggleWatchlist(movie);
    setTimeout(() => setIsRemoving(false), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0 flex items-center">
            <Heart className="text-red-500 mr-3" size={28} fill="currentColor" />
            My Watchlist
            <span className="ml-3 text-lg text-gray-400">
              ({watchlist.length} {watchlist.length === 1 ? 'item' : 'items'})
            </span>
          </h1>
          
          {watchlist.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Sort by:</span>
              <select 
                onChange={(e) => setSortBy(e.target.value)}
                value={sortBy}
                className="bg-gray-800 text-white rounded px-3 py-1 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="added">Recently Added</option>
                <option value="year">Release Year</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          )}
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Heart className="text-gray-600" size={40} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">Your watchlist is empty</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Start adding movies to your watchlist and they'll appear here.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className={`group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${isRemoving ? 'opacity-70' : ''}`}
              >
                {/* Movie Poster with Overlay */}
                <div className="relative">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : '/placeholder-movie.jpg'
                    }
                    alt={movie.title}
                    className="w-full h-72 object-cover cursor-pointer"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => navigate(`/movie/${movie.id}`)}
                      className="flex items-center justify-center w-12 h-12 bg-white/90 rounded-full hover:bg-white transition-all"
                    >
                      <Play className="text-gray-900 pl-1" size={24} />
                    </button>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-4">
                  <h3
                    className="text-lg font-bold truncate cursor-pointer hover:text-purple-400 transition-colors"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    {movie.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                    <div className="flex items-center">
                      <CalendarDays size={14} className="mr-1" />
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                    </div>
                    {movie.vote_average && (
                      <div className="flex items-center">
                        <Star size={14} className="mr-1 text-yellow-400 fill-yellow-400" />
                        {movie.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(movie)}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-red-500/20 text-red-400 hover:text-red-500 py-2 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State Suggestions */}
        {watchlist.length > 0 && (
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold mb-4">Looking for more?</h3>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity inline-flex items-center"
            >
              <Play size={18} className="mr-2" />
              Discover New Movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
}