import { useState, useEffect } from "react";
import Movie from '../components/Movie'
const api_key = process.env.REACT_APP_TMDB_API_KEY;


function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=fr-FR`)
      .then(response => response.json())
      .then(data =>setMovies(data.results))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  return (
    <div className="App">
      <div className="home">
      <h1 className="text-center">Listes des films populaires</h1>
        <div className="movie-container d-flex flex-wrap align-baseline justify-start">
          {movies.map(movie => (
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
  