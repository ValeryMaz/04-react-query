import { fetchMovies } from "../../services/movieService";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  const handleSearch = async (query: string) => {
    try {
      setLoader(true);
      setError(false);
      const movies = await fetchMovies(query);
      // console.log("фильмы", movies);
      setMovies(movies);
      if (movies.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }
    } catch {
      setLoader(false);
      setError(true);
    } finally {
      setLoader(false);
    }
  };
  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {!error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={openModal} />
      )}
      {error && <ErrorMessage />}
      {isModalOpen && selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
      <Toaster />
    </>
  );
}

export default App;
