import { fetchMovies, type MovieResponse } from "../../services/movieService";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setPage] = useState(1);

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };
  const { data, isLoading, isError, isSuccess } = useQuery<MovieResponse>({
    queryKey: ["movieList", searchQuery, currentPage],
    queryFn: () => fetchMovies(searchQuery, currentPage),
    enabled: searchQuery !== "",
    placeholderData: keepPreviousData,
  });
  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };
  useEffect(() => {
    if (isSuccess && movies?.length === 0 && searchQuery !== "") {
      toast.error("No movies found for your request.");
    }
  }, [searchQuery, isSuccess, movies?.length]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {/* {isError && movies.length === 0 && searchQuery !== "" && (
        <div>{toast.error("No movies found for your request.")}</div>
      )} */}
      {isSuccess && movies?.length > 0 && (
        <MovieGrid movies={movies} onSelect={openModal} />
      )}
      {isError && <ErrorMessage />}
      {isModalOpen && selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
      <Toaster />
    </>
  );
}

export default App;
