import React, { useState, useEffect } from "react";
import Movie from "../components/Movie";
import SearchBar from "../components/SearchBar";
const api_key = process.env.REACT_APP_TMDB_API_KEY;

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const handleSearch = (query) => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${query}&language=fr-FR`)
      .then((response) => response.json())
      .then((data) => setSearchResults(data.results))
      .catch((error) => console.error("Error fetching search results:", error));
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=fr-FR`)
      .then((response) => response.json())
      .then((data) => setMovies(data.results))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    getMovieByGenre(event.target.value);
  }

  const getAllGenre = () => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=fr-FR`)
      .then((response) => response.json())
      .then((data) => setGenres(data.genres))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const getMovieByGenre = (genreName) => {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${genreName}&language=fr-FR`)
    .then((response) => response.json())
    .then((data) => setMovies(data.results))
    .catch((error) => console.error("Error fetching data:", error));
};

  useEffect(() => {
    getAllGenre();
  }, []);

  return (
    <div className="App">
      <div className="home">
        <h1 className="text-center">Listes des films populaires</h1>
        <div className="filter d-flex justify-center">
        <SearchBar onSearch={handleSearch} />
        <select onChange={handleGenreChange} value={selectedGenre}>
          <option value="" default>Categorie de film</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        </div>
        <div className="movie-container d-flex flex-wrap align-baseline justify-start">
          {searchResults.length > 0
            ? searchResults.map((movie) => (
                <Movie
                  key={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  movieId={movie.id}
                />
              ))
            : movies.map((movie) => (
                <Movie
                  key={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  movieId={movie.id}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

export default Home;