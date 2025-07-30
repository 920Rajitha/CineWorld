import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Download, Star, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MovieSlider({ title, apiUrl, badge, variant = "default" }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const [hoveredMovie, setHoveredMovie] = useState(null);

  // Variant styles
  const variants = {
    default: {
      card: "bg-[#1a1a2e]",
      text: "text-white",
      button: "bg-purple-600 hover:bg-purple-700"
    },
    dark: {
      card: "bg-gray-900 border border-gray-800",
      text: "text-gray-100",
      button: "bg-gray-700 hover:bg-gray-600"
    },
    light: {
      card: "bg-gray-100 border border-gray-200",
      text: "text-gray-900",
      button: "bg-blue-600 hover:bg-blue-700"
    }
  };

  const currentVariant = variants[variant] || variants.default;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(apiUrl);
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [apiUrl]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getDownloadLink = (quality) => {
    return quality === "720p"
      ? "https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4"
      : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  };

  if (isLoading) {
    return (
      <div className="w-full mt-14">
        <h2 className="text-2xl font-bold px-6 mb-4">{title}</h2>
        <div className="grid grid-flow-col auto-cols-[160px] sm:auto-cols-[180px] gap-4 px-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-64 rounded-xl ${currentVariant.card} animate-pulse`}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-14">
      <div className="flex items-center justify-between px-6 mb-4">
        <h2 className={`text-2xl font-bold ${currentVariant.text}`}>{title}</h2>
        {badge && (
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {badge}
          </span>
        )}
      </div>

      <div className="relative group">
        {/* Scroll Left - Only shows when hovering slider */}
        <button
          onClick={() => scroll("left")}
          className="absolute z-10 left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2 rounded-full backdrop-blur-md shadow transition opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>

        {/* Scrollable Movies */}
        <div
          ref={sliderRef}
          className="grid grid-flow-col auto-cols-[160px] sm:auto-cols-[180px] md:auto-cols-[200px] overflow-x-auto gap-6 px-10 scrollbar-hide scroll-smooth snap-x"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className={`relative ${currentVariant.card} rounded-xl p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:z-10`}
              onMouseEnter={() => setHoveredMovie(movie.id)}
              onMouseLeave={() => setHoveredMovie(null)}
            >
              {/* Rating Badge */}
              <div className="absolute top-3 right-3 flex items-center bg-black/70 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                <Star size={12} className="mr-1 fill-yellow-400 text-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </div>

              {/* Movie Poster with Play Button on Hover */}
              <div className="relative overflow-hidden rounded-md cursor-pointer">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/placeholder-movie.jpg"
                  }
                  alt={movie.title}
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                />
                
                {hoveredMovie === movie.id && (
                  <button
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="absolute inset-0 m-auto flex items-center justify-center w-12 h-12 bg-white/90 rounded-full hover:bg-white transition-all animate-pulse"
                    aria-label="Play movie"
                  >
                    <Play size={24} className="text-gray-900 pl-1" />
                  </button>
                )}
              </div>

              {/* Movie Info */}
              <div className="mt-3">
                <h3
                  className={`text-sm font-bold ${currentVariant.text} truncate cursor-pointer hover:underline`}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  {movie.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(movie.release_date).getFullYear() || "N/A"}
                </p>

                {/* Download Button with Quality Options */}
                <div className="mt-3">
                  <details className="dropdown relative">
                    <summary className={`flex items-center justify-center gap-1 cursor-pointer text-xs ${currentVariant.text} ${currentVariant.button} px-3 py-1.5 rounded-full transition-all`}>
                      <Download size={14} />
                      Download
                    </summary>
                    <div className="dropdown-menu absolute z-20 mt-1 right-0 bg-gray-800 shadow-xl rounded-md w-40 overflow-hidden">
                      <a
                        href={getDownloadLink("720p")}
                        download
                        className="flex items-center justify-between px-4 py-2 hover:bg-gray-700 text-white border-b border-gray-700 text-sm"
                      >
                        <span>720p</span>
                        <span className="text-xs text-gray-400">1.2GB</span>
                      </a>
                      <a
                        href={getDownloadLink("1080p")}
                        download
                        className="flex items-center justify-between px-4 py-2 hover:bg-gray-700 text-white text-sm"
                      >
                        <span>1080p</span>
                        <span className="text-xs text-gray-400">2.5GB</span>
                      </a>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Right - Only shows when hovering slider */}
        <button
          onClick={() => scroll("right")}
          className="absolute z-10 right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2 rounded-full backdrop-blur-md shadow transition opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}