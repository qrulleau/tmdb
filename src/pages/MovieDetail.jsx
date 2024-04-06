import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format} from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from "react-router-dom";
const api_key = process.env.REACT_APP_TMDB_API_KEY;
const api_key_read = process.env.REACT_APP_TMDB_API_KEY_READ;

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');


  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=fr-FR`)
      .then(response => response.json())
      .then(data => setMovieDetails(data))
      .catch(error => console.error('Error fetching movie details:', error));
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${api_key}&language=fr-FR`)
      .then(response => response.json())
      .then(data => setCast(data.cast))
      .catch(error => console.error('Error fetching cast:', error));
  }, [id]);

  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  const handleRatingChange = (event) => {
    setSelectedRating(event.target.value);
    sendRatingToAPI(event.target.value);
  };

  const sendRatingToAPI = (rating) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${api_key_read}`,
      },
      body: JSON.stringify({ value: rating }),
    };
  
    fetch(`https://api.themoviedb.org/3/movie/${id}/rating`, options)
      .then(response => {
        console.log('Response status:', response.status);
        return response.json();
      })
      .then(data => console.log('Rating sent to API:', data))
      .catch(error => console.error('Error sending rating to API:', error));
  };

  const imageUrl = `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`;
  const formattedReleaseDate = format(new Date(movieDetails.release_date), "d MMMM yyyy", { locale: fr });

  return (
    <div className="movie-detail-page">
      <Link to={"/"}>retour</Link>
      <h1 className="text-center">Detail du film : {movieDetails.title}</h1>
      <div className="container">
        <div className="d-flex align-top">
          <img src={imageUrl} alt={movieDetails.title} />
          <div className="description">
            <div className=" title-rating d-flex justify-start">
              <h2>{movieDetails.title}</h2>
              <p>| note du public : {movieDetails.vote_average}</p>
            </div>
            <p className="movie-overview">{movieDetails.overview}</p>
            <p className="movie-casting">Liste des acteurs : {cast.map(actor => (actor.name)).join(', ')}</p>
            <div className=" movie-detail d-flex justify-start">
              <p>{formattedReleaseDate}</p>
              <p>|</p>
              <p>{movieDetails.runtime} minutes</p>
              <p>|</p>
              <p>{movieDetails.genres.map(genre => genre.name).join(', ')}</p>
            </div>
            <div className="personal-opinion d-flex">
              <p>Attribuez lui une note si vous l'avez vu</p>
              <select name="rating" id="rating" value={selectedRating} onChange={handleRatingChange}>
                {[...Array(20).keys()].map((value) => (
                  <option key={value} value={(value + 1) * 0.5}>
                    {(value + 1) * 0.5}
                  </option>
                ))}
              </select>
            </div>
          </div>
      </div>
      </div>
    </div>
  );
}; 
export default MovieDetailPage;