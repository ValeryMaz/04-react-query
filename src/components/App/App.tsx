import { fetchMovies, type MovieResponse } from "../../services/movieService";
import { useState } from "react";
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
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [error, setError] = useState<boolean>(false);
  // const [isLoading, setLoader] = useState(false);
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
  const { data, error, isLoading, isError, isSuccess } =
    useQuery<MovieResponse>({
      queryKey: ["movieList", searchQuery, currentPage], //currentPage
      queryFn: () => fetchMovies(searchQuery, currentPage), //currentPage
      enabled: searchQuery !== "",
      placeholderData: keepPreviousData,
    });
  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;
  // const { data, error, isLoading, isError } = useQuery({
  //   queryKey: ["movieList", searchQuery],
  //   queryFn: () => fetchMovies(searchQuery),
  // });

  const handleSearch = async (query: string) => {
    // try {
    // setLoader(true);
    // setError(false);
    setSearchQuery(query);
    setPage(1);
    // const movies = await fetchMovies(query);
    // console.log("фильмы", movies);
    // setMovies(movies);
    // if (movies?.length === 0) {
    //   toast.error("No movies found for your request.");
    //   return;
    // }
  };

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
      {isSuccess && movies.length === 0 && searchQuery !== "" && (
        <div>{toast.error("No movies found for your request.")}</div>
      )}
      {!error && movies?.length > 0 && (
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
