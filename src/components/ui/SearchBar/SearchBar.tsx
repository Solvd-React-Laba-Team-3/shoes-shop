'use client';
import { FC } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
  SearchContainer,
  StyledInputBase,
  SearchIconWrapper,
} from './searchBar.styles';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  placeholder?: string;
  expandOnFocus?: boolean;
  size?: 'small' | 'medium';
}

export const SearchBar: FC<SearchBarProps> = ({
  value,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  inputRef,
  placeholder = 'Search',
  expandOnFocus = false,
  size = 'small',
}) => {
  return (
    <SearchContainer expandOnFocus={expandOnFocus} size={size}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        expandOnFocus={expandOnFocus}
        size={size}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search' }}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        inputRef={inputRef}
      />
    </SearchContainer>
  );
};
