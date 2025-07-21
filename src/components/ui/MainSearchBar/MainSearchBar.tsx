'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
// import {  useRouter, } from 'next/navigation';
import { SearchBar } from '../SearchBar/SearchBar';

export const MainSearchBar = () => {
  //   const router = useRouter();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const search = searchParams.get('search') || '';
    setInputValue(search);
  }, [searchParams]);

  //   const handleSearch = (value: string) => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     params.set('search', value);
  //     router.push(`?${params.toString()}`);
  //   };

  //   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //     if (e.key === 'Enter') {
  //       handleSearch(inputValue.trim());
  //     }
  //   };

  return (
    <SearchBar
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Search"
      expandOnFocus
      size="medium"
    />
  );
};
