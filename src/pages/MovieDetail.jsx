import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { format} from 'date-fns';
import { fr } from 'date-fns/locale';
import Notification from "../components/Notification";
import { ReactComponent as StarIcon } from '../assets/star.svg';
import { initDB, addComment, getCommentFromIndexedDB } from '../utils/IndexDB'

const api_key = process.env.REACT_APP_TMDB_API_KEY;
const api_key_read = process.env.REACT_APP_TMDB_API_KEY_READ;
const account_id = process.env.REACT_APP_TMDB_ACCOUNT_ID;

const getFavoriteMovie = (movieId, setIsFavorite) => {
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${api_key_read}`
    }
  };

  fetch(`https://api.themoviedb.org/3/account/${account_id}/favorite/movies?language=fr-FR&page=1`, options)
    .then(response => response.json())
    .then(data => {
      const favoriteMovies = data.results;
      const isFavorite = favoriteMovies.some(movie => movie.id === movieId);
      if (isFavorite) {
        setIsFavorite(isFavorite);
      }
    })
    .catch(error => console.error('Error fetching favorited movies:', error));
}

const getRankingMovie = (movieId, setSelectedRating) => {
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${api_key_read}`
    }
  };

  fetch(`https://api.themoviedb.org/3/account/${account_id}/rated/movies?language=fr-FR&page=1`, options)
    .then(response => response.json())
    .then(data => {
      const ratedMovies = data.results;
      const isRated = ratedMovies.some(movie => movie.id === movieId);
      if (isRated) {
        const ratedMovie = ratedMovies.find(movie => movie.id === movieId);
        setSelectedRating(ratedMovie.rating);
      }
    })
    .catch(error => console.error('Error fetching rated movies:', error));
};

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [notification, setNotification] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    initDB((error, db) => {
      if (error) {
        console.error(error);
        return;
      }

      getCommentFromIndexedDB(id, (commentError, comment) => {
        if (commentError) {
          console.error(commentError);
          return;
        }

        setComment(comment);
      });
    });
  }, [id]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = () => {
    if (comment !== null && comment.trim() !== '') {
      addComment(id, comment, (error) => {
        if (error) {
          setNotification({ message: "Erreur lors de l'envoi du commentaire", type: "error" });
          console.error('Error adding comment:', error);
        } else {
          setComment('');
          setNotification({ message: "Commentaire envoyé avec succès", type: "success" });
          setTimeout(() => {
            setNotification(null)
          }, 3000);
        }
      });
    } else {
      setNotification({ message: "Le commentaire ne peut pas être vide", type: "error" });
    }
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=fr-FR`)
      .then(response => response.json())
      .then(data => {
        setMovieDetails(data);
        getRankingMovie(data.id, setSelectedRating);
        getFavoriteMovie(data.id, setIsFavorite);
      })
      .catch(error => console.error('Error fetching movie details:', error));
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${api_key}&language=fr-FR`)
      .then(response => response.json())
      .then(data => {
        const actors = data.cast.filter(person => person.known_for_department === "Acting" && person.popularity > 5);
        setCast(actors);
      })
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
        if (response.ok) {
          setNotification({ message: "Notation bien envoyée", type: "success" });
          setTimeout(() => {
            setNotification(null)
          }, 3000);
        } else {
          setNotification({ message: "Un problème est survenu", type: "error" });
          setTimeout(() => {
            setNotification(null)}, 3000);
        }
        console.log('Response status:', response.status);
        return response.json();
      })
      .then(data => console.log('Rating sent to API:', data))
      .catch(error => {
        setNotification({ message: "Un problème est survenu", type: "error" });
        console.error('Error sending rating to API:', error);
      });
  };

  const addFavoriteToAPI = () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${api_key_read}`,
      },
      body: JSON.stringify({
        media_type: 'movie',
        media_id: id,
        favorite: !isFavorite
      }),
    };
  
    return fetch(`https://api.themoviedb.org/3/account/${account_id}/favorite`, options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Un problème est survenu');
        }
        return response.json();
      });
  };

  const toggleFavorite = () => {
    if (!isFavorite) {
      setNotification({ message: "Film ajouté aux favoris", type: "success" });
      setTimeout(() => {setNotification(null)}, 3000);
    }else {
      setNotification({ message: "Film retiré des favoris", type: "success" });
      setTimeout(() => {setNotification(null)},3000);
    }
    setIsFavorite(!isFavorite);
    addFavoriteToAPI()
      .catch(error => {
        setNotification({ message: "Un problème est survenu", type: "error" });
        console.error('Error adding favorite:', error);
      });
  };

  const imageUrl = `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`;
  const formattedReleaseDate = format(new Date(movieDetails.release_date), "d MMMM yyyy", { locale: fr });

  return (
    <div className="movie-detail-page">
      <div className="d-flex btn-back">
      <Link to={"/"}>retour</Link>
      </div>
      <h1 className="text-center">Detail du film : {movieDetails.title}</h1>
      <div className="container">
        <div className="d-flex justify-center align-top">
          <img src={imageUrl} alt={movieDetails.title} />
          <div className="description">
            <StarIcon className={isFavorite ? 'favorite' : ''} onClick={toggleFavorite} />
            <div className=" title-rating d-flex justify-start">
              <h2>{movieDetails.title}</h2>
              <p>| note du public : {movieDetails.vote_average}</p>
            </div>
            <p className="movie-overview">{movieDetails.overview}</p>
            <p className="movie-casting">Acteurs principaux : {cast.map(actor => (actor.name)).join(', ')}</p>
            <div className=" movie-detail d-flex justify-start">
              <p>{formattedReleaseDate}</p>
              <p>|</p>
              <p>{movieDetails.runtime} minutes</p>
              <p>|</p>
              <p>{movieDetails.genres.map(genre => genre.name).join(', ')}</p>
            </div>
            <div className="personal-rating d-flex">
              <p>Attribuez lui une note si vous l'avez vu</p>
              <select name="rating" id="rating" value={selectedRating} onChange={handleRatingChange}>
                {[...Array(20).keys()].map((value) => (
                  <option key={value} value={(value + 1) * 0.5}>
                    {(value + 1) * 0.5}
                  </option>
                ))}
              </select>
            </div>
            <div className="personal-commentary">
            <p>Donnez votre avis</p>
            <textarea name="comment" id="comment" cols="30" rows="10" onChange={handleCommentChange}>{comment}</textarea>
            <button type="submit" onClick={handleCommentSubmit}>Envoyer</button>
            </div>
            {notification && <Notification message={notification.message} type={notification.type} className={notification ? 'fade-out' : ''} />}
          </div>
      </div>
      </div>
    </div>
  );
}; 
export default MovieDetailPage;