'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
import SearchIcon from '@mui/icons-material/Search';

import Link from 'next/link';
import Image from 'next/image';
import { useDebounce, useDeviceSize, useSearchParams } from '@/lib/hooks';
import { List, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { useQuery } from '@tanstack/react-query';
import { searchPopularTermsOptions } from '@/api/gemini/getPopularSearchTermsOptions';
import { AI_REQUEST_STALE_TIME } from '@/constants/queriesStaleTime';

export const MainSearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { update, searchParams } = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams.get('search') || ''
  );
  const [isFocused, setIsFocused] = useState(false);
  const [popularTerms, setPopularTerms] = useState<string[]>([]);
  const { debouncedValue, isDebouncing } = useDebounce(inputValue, 2000);
  const inputRef = useRef<HTMLInputElement>(null);

  const queryOptions = searchPopularTermsOptions(debouncedValue);

  const {
    data: popularResults,
    isSuccess,
    isFetching,
  } = useQuery({
    ...queryOptions,
    enabled: debouncedValue.length === 0 || debouncedValue.length > 2,
    staleTime: AI_REQUEST_STALE_TIME,
  });

  useEffect(() => {
    if (isSuccess && popularResults) {
      setPopularTerms(popularResults);
    }
  }, [isSuccess, popularResults]);

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (params.get('search') === trimmedValue) return;
    params.set('search', trimmedValue);

    if (pathname !== '/') {
      router.push(`/?${params.toString()}`);
    } else {
      update(params);
    }

    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(inputValue.trim());
    }
  };

  const handleClose = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    inputRef.current?.blur();
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // setIsFocused(false);
  };

  const handleTermClick = (term: string) => {
    setInputValue(term);
    handleSearch(term);
    handleClose();
  };

  const { isMobile } = useDeviceSize();

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
      {isMobile && !isFocused && (
        <IconButton
          onClick={handleFocus}
          sx={{ paddingRight: '20px' }}
          color="secondary"
        >
          <SearchIcon />
        </IconButton>
      )}
      {!isMobile || isFocused ? (
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
            autoFocus={isMobile}
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
      ) : null}
    </>
  );
};
