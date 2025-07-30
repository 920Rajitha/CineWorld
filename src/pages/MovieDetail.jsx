import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useWatchlist } from "../context/WatchlistContext";
import { Star, Heart, Play, Clock, Calendar, Download, Share2 } from "lucide-react";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const API_KEY = "ae22899043ac52c1eff3dde13c032381";

        const [details, videos, credits, similar] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`)
        ]);

        setMovie(details.data);
        
        const officialTrailer = videos.data.results.find(
          v => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailer(officialTrailer);

        setCast(credits.data.cast.slice(0, 8));
        setSimilarMovies(similar.data.results.slice(0, 6));
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 animate-pulse">
          <div className="w-full md:w-1/3 h-[500px] bg-gray-800 rounded-lg"></div>
          <div className="md:w-2/3 space-y-4">
            <div className="h-10 w-3/4 bg-gray-800 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-800 rounded"></div>
            <div className="h-20 w-full bg-gray-800 rounded"></div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 w-16 bg-gray-800 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Movie not found</h2>
        <p className="text-gray-400 mt-2">We couldn't find the movie you're looking for</p>
      </div>
    </div>
  );

  const inList = isInWatchlist(movie.id);
  const runtimeHours = Math.floor(movie.runtime / 60);
  const runtimeMinutes = movie.runtime % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Backdrop and Main Content */}
        <div className="relative mb-12">
          {/* Backdrop Image with Gradient Overlay */}
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
            {movie.backdrop_path && (
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-full object-cover opacity-20 blur-sm"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-8 pt-8">
            {/* Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4 transition-transform hover:-translate-y-2">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/placeholder-movie.jpg"
                }
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl border-2 border-gray-700/50"
              />
            </div>

            {/* Movie Info */}
            <div className="md:w-2/3 lg:w-3/4 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                  {movie.title} 
                  <span className="text-gray-400 ml-2">({new Date(movie.release_date).getFullYear()})</span>
                </h1>
                
                {movie.tagline && (
                  <p className="text-lg text-purple-300 italic mb-4">"{movie.tagline}"</p>
                )}

                {/* Rating and Metadata */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center bg-gray-800/80 px-3 py-1 rounded-full">
                    <Star className="fill-yellow-400 text-yellow-400 mr-1" size={18} />
                    <span className="font-bold">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-gray-400 ml-1">/10</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-300">
                    <Calendar size={16} className="mr-1" />
                    {new Date(movie.release_date).toLocaleDateString()}
                  </div>

                  <div className="flex items-center text-sm text-gray-300">
                    <Clock size={16} className="mr-1" />
                    {runtimeHours}h {runtimeMinutes}m
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((g) => (
                    <span 
                      key={g.id} 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full text-sm"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Overview */}
              <div>
                <h2 className="text-xl font-bold mb-2">Storyline</h2>
                <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() =>
                    toggleWatchlist({
                      id: movie.id,
                      title: movie.title,
                      poster_path: movie.poster_path,
                      release_date: movie.release_date,
                    })
                  }
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    inList
                      ? "bg-red-500/90 hover:bg-red-600"
                      : "bg-purple-600/90 hover:bg-purple-700"
                  }`}
                >
                  <Heart className={inList ? "fill-white" : ""} size={18} />
                  {inList ? "In Watchlist" : "Add to Watchlist"}
                </button>

                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
                  >
                    <Play size={18} />
                    Watch Trailer
                  </a>
                )}

                <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-all">
                  <Download size={18} />
                  Download
                </button>

                <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-all">
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trailer Section */}
        {trailer && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
              <Play className="text-purple-400" /> Official Trailer
            </h2>
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0&rel=0`}
                title={`${movie.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-64 md:h-96 lg:h-[500px]"
              />
            </div>
          </section>
        )}

        {/* Cast Section */}
        {cast.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {cast.map((actor) => (
                <div 
                  key={actor.id} 
                  className="bg-gray-800/50 hover:bg-gray-700/50 p-3 rounded-xl text-center shadow-md transition-all border border-gray-700/30 hover:-translate-y-1"
                >
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={actor.name}
                    className="w-full h-40 md:h-48 object-cover rounded-lg mb-3 mx-auto"
                  />
                  <h3 className="text-sm font-bold">{actor.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Movies Section */}
        {similarMovies.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gray-800/50 hover:bg-gray-700/50 rounded-xl overflow-hidden shadow-md transition-all border border-gray-700/30 hover:scale-105"
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/placeholder-movie.jpg"
                    }
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}