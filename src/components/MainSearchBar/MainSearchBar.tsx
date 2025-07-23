'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
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
import { useDebounce } from '@/lib/hooks/useDebounce';
import { List, Typography } from '@mui/material';
import { getPopularSneakerTerms } from '@/api/gemini/getPopularSneakerTerms';

const CACHE_EXPIRATION_MS = 5 * 60 * 1000;
const searchSuggestionsCache = new Map<
  string,
  { timestamp: number; data: string[] }
>();

const defaultPopularTerms = ['Nike Dunks', 'Adidas Yeezy', 'Jordan 1'];
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeList(list: string[]): string[] {
  return list.map(capitalize);
}

export const MainSearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [popularTerms, setPopularTerms] = useState<string[]>([]);
  const debouncedInput = useDebounce(inputValue, 200);

  async function fetchPopularTerms(query: string): Promise<string[]> {
    if (!query.trim()) return [];
    return await getPopularSneakerTerms(query);
  }

  useEffect(() => {
    const search = searchParams.get('search') || '';
    setInputValue(search);
  }, [searchParams]);

  useEffect(() => {
    const getTerms = async () => {
      const normalizedQuery = debouncedInput.trim().toLowerCase();

      if (!normalizedQuery || normalizedQuery.length < 2) {
        setPopularTerms(defaultPopularTerms);
        return;
      }

      const cached = searchSuggestionsCache.get(normalizedQuery);
      const now = Date.now();

      if (cached && now - cached.timestamp < CACHE_EXPIRATION_MS) {
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `[CACHE] Serving from cache for query: "${normalizedQuery}"`
          );
        }
        setPopularTerms(capitalizeList(cached.data));
        return;
      }

      try {
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `[API CALL] Fetching from API for query: "${normalizedQuery}"`
          );
        }
        const terms = await fetchPopularTerms(normalizedQuery);
        setPopularTerms(capitalizeList(terms.length > 0 ? terms : []));
        searchSuggestionsCache.set(normalizedQuery, {
          data: terms,
          timestamp: now,
        });
      } catch (err) {
        console.error('[AUTOCOMPLETE_ERROR]', err);
        setPopularTerms([]);
      }
    };

    getTerms();
  }, [debouncedInput]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

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
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsFocused(true);
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, 150);
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
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search"
          expandOnFocus
          size="medium"
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-testid="search-input"
        />
        {popularTerms.length > 0 && isFocused && (
          <PopularTermsContainer data-testid="popular-terms-container">
            <Typography variant="h6" fontWeight={500}>
              Popular Search Terms
            </Typography>
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
