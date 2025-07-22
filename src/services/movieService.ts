import axios from "axios";
import type { Movie } from "../types/movie";

export interface MovieResponse {
  results: Movie[];
  total_pages: number;
}
export const fetchMovies = async (
  query: string,
  page: number
): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query: query,
        page: page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );
  console.log(response);
  return response.data;
};
