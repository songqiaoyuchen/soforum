'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { resetFilters } from '@/store/slices/filterSlice';

export default function NavigationListener() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset filters when pathname changes
    dispatch(resetFilters());
  }, [pathname, dispatch]);

  return null; 
}