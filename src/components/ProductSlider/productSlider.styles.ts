import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledSliderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  width: '100%',
  minHeight: 0,
  gap: theme.spacing(2),
  overflowX: 'hidden',
  overflowY: 'visible',
  alignItems: 'stretch',

  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },

  '& .thumb-swiper .swiper-slide': {
    position: 'relative',
    opacity: 0.8,
    transition: 'opacity 0.1s ease-in',
    width: 76,
    height: 76,
    aspectRatio: '1 / 1',
    overflow: 'hidden',

    [theme.breakpoints.down('lg')]: {
      height: 'auto',
    },
  },

  '& .thumb-swiper .swiper-slide:hover': { opacity: 1 },
  '& .thumb-swiper .swiper-slide.swiper-slide-thumb-active': { opacity: 1 },
  '& .thumb-swiper .swiper-slide img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  '& .thumb-swiper .swiper-slide-thumb-active img': {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  '& .swiper-button-next, & .swiper-button-prev': {
    display: 'none !important',
  },
}));

export const StyledWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  aspectRatio: '1 / 1',
  position: 'relative',
  minHeight: '300px',
  '& .swiper': { height: '100%' },
  '& .swiper-wrapper': { height: '100%' },
  '& .swiper-slide': { height: '100%', minHeight: '1px' },

  '& .main-nav-prev, & .main-nav-next': {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: theme.palette.common.white,
    color: theme.palette.text.primary,
    display: 'grid',
    placeItems: 'center',
    boxShadow: 'none',
    cursor: 'pointer',
    zIndex: 10,
  },
  '& .main-nav-prev.swiper-button-disabled, & .main-nav-next.swiper-button-disabled':
    {
      opacity: 0.4,
      pointerEvents: 'none',
    },

  '& .main-nav-next': { right: 36, bottom: 24 },
  '& .main-nav-prev': { right: 76, bottom: 24 },
  [theme.breakpoints.down('lg')]: {
    '& .main-nav-prev': { left: 8, top: '50%', transform: 'translateY(-50%)' },
    '& .main-nav-next': { right: 8, top: '50%', transform: 'translateY(-50%)' },
  },
}));

export const StyledThumbsWrapper = styled(Box)(({ theme }) => ({
  flex: '0 0 auto',
  minHeight: 0,
  order: 0,
  width: 76,
  minWidth: 76,
  height: 'auto',
  contain: 'layout size',
  alignSelf: 'stretch',
  [theme.breakpoints.down('md')]: {
    order: 2,
    width: '100%',
    contain: 'unset',
  },
}));
