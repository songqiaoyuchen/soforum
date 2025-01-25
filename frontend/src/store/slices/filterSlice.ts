import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  searchQuery: string;
  category: string;
  sort: string
}

const initialState: FiltersState = {
  searchQuery: '',
  category: '',
  sort: '',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setSort(state, action: PayloadAction<string>) {
      state.sort = action.payload;
    },
    resetFilters(state) {
      state.searchQuery = '';
      state.category = '';
    }
  }
});

export const { setSearchQuery, setCategory, setSort, resetFilters } = filterSlice.actions;

export default filterSlice.reducer;
