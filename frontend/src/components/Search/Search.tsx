import { SearchBox, StyledInputBase, SearchIconWrapper } from './Search.styles';
import SearchIcon from '@mui/icons-material/Search';

function Search() {
  return (
    <SearchBox>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
      />
    </SearchBox>
  )
}

export default Search

