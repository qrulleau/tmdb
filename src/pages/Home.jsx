import React, { useState, useEffect } from "react";

import Movie from "../components/Movie";
import SearchBar from "../components/SearchBar";

const api_key = process.env.REACT_APP_TMDB_API_KEY;

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [title, setTitle] = useState('')

  const handleSearch = (query) => {
    fetch(`https://api.themoviedb.org/3/search/multi?api_key=${api_key}&query=${query}&include_adult=false&language=fr-FR`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data.results);
        setTitle(`des résultats associés à : ${query}`);
      })
      .catch((error) => console.error("Error fetching search results:", error));
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=fr-FR`)
      .then((response) => response.json())
      .then((data) => {
        const popularMovie = data.results.map(movie => ({ ...movie, media_type: "movie" }));
        setMovies(popularMovie);
        setTitle("des films populaires");
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleGenreChange = (event) => {
    const selectedGenreName = event.target.options[event.target.selectedIndex].text;
    setSelectedGenre(event.target.value);
    getMovieByGenre(event.target.value, selectedGenreName);
  }

  const getAllGenre = () => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=fr-FR`)
      .then((response) => response.json())
      .then((data) => setGenres(data.genres))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const getMovieByGenre = (genreId, genreName) => {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${genreId}&language=fr-FR`)
    .then((response) => response.json())
    .then((data) => {
      const movie = data.results.map(movie => ({...movie, media_type: "movie" }));
      setMovies(movie);
      setTitle(`des films de la categorie: ${genreName}`);
    })
    .catch((error) => console.error("Error fetching data:", error));
};

  useEffect(() => {
    getAllGenre();
  }, []);

  return (
    <div className="App">
      <div className="home">
        <h1 className="text-center">Liste {title}</h1>
        <div className="filter d-flex justify-center">
        <SearchBar onSearch={handleSearch} />
        <select onChange={handleGenreChange} value={selectedGenre}>
          <option value="" default>Categorie de film</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        </div>
        <div className="movie-container">
          <div className="d-flex flex-wrap align-baseline justify-start">
            {searchResults.length > 0
              ? searchResults.map((movie) => (
                  <Movie
                    key={movie.id}
                    title={movie.title || movie.name}
                    posterPath={movie.poster_path || movie.profile_path}
                    movieId={movie.id}
                    type={movie.known_for_department || movie.media_type}
                    knownFor={movie.known_for}
                  />
                ))
              : movies.map((movie) => (
                  <Movie
                    key={movie.id}
                    title={movie.title}
                    posterPath={movie.poster_path}
                    type={movie.media_type}
                    movieId={movie.id}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;