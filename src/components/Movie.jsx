import { Link } from "react-router-dom";

import defaultImage from "../assets/default-image.jpg";

const Movie = ({ title, posterPath, movieId, type, knownFor }) => {
    return (
        <div className="movie">
            {type === 'Acting' ? (
                <div className="acting">
                    <div className="thumbnail">
                        {posterPath ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w185/${posterPath}`}
                                alt={title}
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        ) : (
                            <img
                                src={defaultImage}
                                alt="Default"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        )}
                    </div>
                    <div className="description">
                        <h2>{title} - {type}</h2>
                        {type === 'Acting' && (
                            <div className="know-for-movie">
                                <p>Vu dans:</p>
                                <div className="d-flex direction-column align-start">
                                    {knownFor.map((film) => (
                                        <Link key={film.id} to={`/movie/${film.id}`}>- {film.title}</Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <Link to={`/movie/${movieId}`} className="movie-link">
                    <div className="thumbnail">
                        {posterPath ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w185/${posterPath}`}
                                alt={title}
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        ) : (
                            <img
                                src={defaultImage}
                                alt="Default"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        )}
                    </div>
                    <div className="description d-flex justify-center align-center">
                        <h2>{title} - {type}</h2>
                    </div>
                </Link>
            )}
        </div>
    );
};

export default Movie;
