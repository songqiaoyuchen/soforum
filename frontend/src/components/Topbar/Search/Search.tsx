'use client';

import React, { useState } from 'react';
import { setSearchQuery } from '@store/slices/filterSlice';
import store from '@store'; 
import { SearchBox, StyledInputBase, SearchIconWrapper } from './Search.styles';
import SearchIcon from '@mui/icons-material/Search';

function Search() {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      // Dispatch the search query when the "Enter" key is pressed
      store.dispatch(setSearchQuery(inputValue));
    }
  };


  return (
    <SearchBox>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </SearchBox>
  );
};

export default Search;
