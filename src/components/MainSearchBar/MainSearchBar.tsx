'use client';

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
import { fetchPopularTerms } from '@/actions/getPopularTerms';
import { List, Typography } from '@mui/material';

export const MainSearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [popularTerms, setPopularTerms] = useState<string[]>([]);

  const debouncedInput = useDebounce(inputValue, 300);

  useEffect(() => {
    const search = searchParams.get('search') || '';
    setInputValue(search);
  }, [searchParams]);

  useEffect(() => {
    const getTerms = async () => {
      if (!debouncedInput.trim()) {
        setPopularTerms([]);
        return;
      }

      try {
        const terms = await fetchPopularTerms(debouncedInput);
        setPopularTerms(terms);
      } catch (err) {
        console.error('[AUTOCOMPLETE_ERROR]', err);
      }
    };

    getTerms();
  }, [debouncedInput]);

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

  return (
    <>
      {isFocused && <Overlay onClick={handleClose} />} {}
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
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputRef={inputRef}
        />

        {popularTerms.length > 0 && isFocused && (
          <PopularTermsContainer>
            <Typography variant="h6" fontWeight={500}>
              Popular Search Terms
            </Typography>

            <List disablePadding>
              {popularTerms.map((term, index) => (
                <PopularTermItem
                  key={index}
                  onClick={() => {
                    setInputValue(term);
                    handleSearch(term);
                    handleClose();
                  }}
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
