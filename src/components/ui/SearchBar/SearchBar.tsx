'use client';
import { FC } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
  SearchContainer,
  StyledInputBase,
  SearchIconWrapper,
} from './searchBar.styles';
import { InputBaseProps } from '@mui/material/InputBase';

export interface SearchBarProps extends InputBaseProps {
  expandOnFocus?: boolean;
  size?: 'small' | 'medium';
}

export const SearchBar: FC<SearchBarProps> = ({
  expandOnFocus = false,
  size = 'small',
  placeholder = 'Search',
  ...props
}) => {
  return (
    <SearchContainer expandOnFocus={expandOnFocus} size={size}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        expandOnFocus={expandOnFocus}
        size={size}
        inputProps={{ 'aria-label': 'search' }}
        placeholder={placeholder}
        {...props}
      />
    </SearchContainer>
  );
};
