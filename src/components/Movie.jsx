const Movie = ({ title, posterPath, movieId }) => {
  return (
    <a href={`/movie/${movieId}`}>
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
    </a>
  );
};

export default Movie;