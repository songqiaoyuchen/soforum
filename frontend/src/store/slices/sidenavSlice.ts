import { createSlice } from '@reduxjs/toolkit';

interface SidenavState {
  isOpen: boolean;
}

const initialState: SidenavState = {
  isOpen: false,
};

const sidenavSlice = createSlice({
  name: 'sidenav',
  initialState,
  reducers: {
    toggleSidenav: (state) => {
      state.isOpen = !state.isOpen;
    },
    openSidenav: (state) => {
      state.isOpen = true;
    },
    closeSidenav: (state) => {
      state.isOpen = false;
    },
  },
});

export const { toggleSidenav, openSidenav, closeSidenav } = sidenavSlice.actions;
export default sidenavSlice.reducer; 