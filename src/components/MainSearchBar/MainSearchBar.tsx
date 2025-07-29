'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SearchBar } from '../ui';
import {
  MainSearchBarContainer,
  IconButtonLeft,
  IconButtonRight,
  Overlay,
  PopularTermsContainer,
  PopularTermItem,
} from './mainSearchBar.styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { List, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { useQuery } from '@tanstack/react-query';
import { searchPopularTermsOptions } from '@/api/gemini/getPopularSearchTermsOptions';

export const MainSearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams.get('search') || ''
  );

  const [isFocused, setIsFocused] = useState(false);
  const [popularTerms, setPopularTerms] = useState<string[]>([]);
  const { debouncedValue: debouncedInput, isDebouncing } = useDebounce(
    inputValue,
    2000
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: popularResults,
    isSuccess,
    isFetching,
  } = useQuery(searchPopularTermsOptions(debouncedInput));

  useEffect(() => {
    if (isSuccess && popularResults) {
      setPopularTerms(popularResults);
    }
  }, [isSuccess, popularResults]);

  const handleSearch = (value: string) => {
    if (searchParams.get('search') === value) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('search', value);

    const newQuery = `?${params.toString()}`;

    if (pathname !== '/') {
      router.push(`/${newQuery}`);
    } else {
      router.push(newQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(inputValue.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    inputRef.current?.blur();
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleTermClick = (term: string) => {
    setInputValue(term);
    handleSearch(term);
    handleClose();
  };

  return (
    <>
      {isFocused && <Overlay data-testid="overlay" onClick={handleClose} />}
      {isFocused && (
        <>
          <IconButtonLeft>
            <Link href="/">
              <Image src="/logo.png" alt="logo" width={40} height={30} />
            </Link>
          </IconButtonLeft>
          <IconButtonRight>
            <IconButton
              onClick={handleClose}
              aria-label="Close search overlay"
              data-testid="close-button"
            >
              <CloseIcon
                color="secondary"
                sx={{ width: 32, height: 32, fontWeight: 400 }}
              />
            </IconButton>
          </IconButtonRight>
        </>
      )}
      <MainSearchBarContainer
        isFocused={isFocused}
        data-testid="search-container"
      >
        <SearchBar
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
          }}
          placeholder="Search"
          expandOnFocus
          size="medium"
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputRef={inputRef}
          data-testid="search-input"
        />
        {popularTerms.length > 0 && isFocused && (
          <PopularTermsContainer
            data-testid="popular-terms-container"
            sx={{ position: 'relative' }}
          >
            {(isFetching || isDebouncing) && (
              <LinearProgress
                data-testid="loading-bar"
                sx={{
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100%',
                  maxWidth: 1040,
                  zIndex: 1,
                }}
              />
            )}
            <Typography variant="h6">Popular Search Terms</Typography>
            <List disablePadding>
              {popularTerms.map((term, index) => (
                <PopularTermItem
                  key={index}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleTermClick(term)}
                  data-testid={`popular-term-${index}`}
                >
                  <Typography variant="body1" fontWeight={500}>
                    {term}
                  </Typography>
                </PopularTermItem>
              ))}
            </List>
          </PopularTermsContainer>
        )}
      </MainSearchBarContainer>
    </>
  );
};
