'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { useDebounce } from '@/lib/hooks/';
import { List, Typography } from '@mui/material';
import { getPopularSneakerTerms } from '@/api/gemini/getPopularSneakerTerms';
import LinearProgress from '@mui/material/LinearProgress';
import { AI_REQUEST_STALE_TIME } from '@/constants/queriesStaleTime';

const searchSuggestionsCache = new Map<
  string,
  { timestamp: number; data: string[] }
>();

export const MainSearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams.get('search') || ''
  );
  const [isFocused, setIsFocused] = useState(false);
  const [popularTerms, setPopularTerms] = useState<string[]>([]);
  const debouncedInput = useDebounce(inputValue, 2000);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedInitialTerms, setHasFetchedInitialTerms] = useState(false);

  useEffect(() => {
    const getTerms = async () => {
      const normalizedQuery = (debouncedInput as string).trim().toLowerCase();
      const now = Date.now();

      const cached = searchSuggestionsCache.get(normalizedQuery);
      if (cached && now - cached.timestamp < AI_REQUEST_STALE_TIME) {
        setPopularTerms(cached.data);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const terms = await getPopularSneakerTerms(normalizedQuery);
        setPopularTerms(terms.length > 0 ? terms : []);
        searchSuggestionsCache.set(normalizedQuery, {
          data: terms,
          timestamp: now,
        });
      } catch {
        setPopularTerms([]);
      } finally {
        setIsLoading(false);
      }
    };

    if ((debouncedInput as string).trim() === '' && !hasFetchedInitialTerms) {
      setHasFetchedInitialTerms(true);
    }

    setIsLoading(true);
    getTerms();
  }, [debouncedInput, hasFetchedInitialTerms]);

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
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
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
          data-testid="search-input"
        />
        {popularTerms.length > 0 && isFocused && (
          <PopularTermsContainer
            data-testid="popular-terms-container"
            sx={{ position: 'relative' }}
          >
            {isLoading && (
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
