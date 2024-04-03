import { Link } from "react-router-dom";

const Movie = ({ title, posterPath, movieId }) => {
  return (
    <Link to={`/movie/${movieId}`} className="movie-link">
        <div className="movie">
            <div className="thumbnail">
                {posterPath ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w185/${posterPath}`}
                        alt={title}
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                ) : null}
            </div>
        <div className="description">
            <h2>{title}</h2>
        </div>
        </div>
    </Link>
  );
};

export default Movie;