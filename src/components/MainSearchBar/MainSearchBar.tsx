'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBar } from '../SearchBar/SearchBar';
import {
  MainSearchBarContainer,
  IconButtonLeft,
  IconButtonRight,
  Overlay,
} from './mainSearchBar.styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import Image from 'next/image';

export const MainSearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const search = searchParams.get('search') || '';
    setInputValue(search);
  }, [searchParams]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', value);
    router.push(`?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(inputValue.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setIsFocused(false);
    inputRef.current?.blur();
  };

  return (
    <>
      {isFocused && <Overlay />}

      {isFocused && (
        <>
          <IconButtonLeft>
            <Link href="/">
              <Image src="/logo.png" alt="logo" width={40} height={30} />
            </Link>
          </IconButtonLeft>

          <IconButtonRight>
            <IconButton onClick={handleClose}>
              <CloseIcon
                color="secondary"
                sx={{ width: 32, height: 32, fontWeight: 400 }}
              />
            </IconButton>
          </IconButtonRight>
        </>
      )}

      <MainSearchBarContainer isFocused={isFocused}>
        <SearchBar
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search"
          expandOnFocus
          size="medium"
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          inputRef={inputRef}
        />
      </MainSearchBarContainer>
    </>
  );
};
