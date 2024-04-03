import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`)
      .then(response => response.json())
      .then(data => setMovieDetails(data))
      .catch(error => console.error('Error fetching movie details:', error));
  }, [id]);

  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-detail-page">
      <h1>{movieDetails.title}</h1>
      <p>{movieDetails.overview}</p>
      <h4>fdfd</h4>
    </div>
  );
};

export default MovieDetailPage;