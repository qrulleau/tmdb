import React, { useState } from 'react';

import {ReactComponent as SearchIcon} from '../assets/search.svg';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Rechercher un film ..."
        value={query}
        onChange={handleChange}
      />
      <button type="submit" className="search-button">
        <SearchIcon />
      </button>
    </form>
  );
};

export default SearchBar;