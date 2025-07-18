import {
  Box,
  Paper,
  Stack,
  Typography,
  Rating,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const StyledPaper = styled(Paper)(({ theme }) => ({
  color: theme.palette.text.secondary,
  boxSizing: 'border-box',
  background: `
    radial-gradient(55.99% 112.1% at 69.71% 44.01%, rgba(253, 253, 253, 0.074) 0%, rgba(0, 0, 0, 0) 100%),
    radial-gradient(64.9% 185.04% at 19.81% 27.89%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.06) 100%)
  `,
  backdropFilter: 'blur(12px)',
  borderRadius: '32px',
  padding: theme.spacing(4),
  display: 'grid',
  justifyItems: 'start',
  width: '756px',
}));

const SwiperContainer = styled(IconButton)(() => ({
  backdropFilter: 'blur(24px)',
  border: '2px solid #FFFFFFA3',
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const ReviewWrapper = styled(Box)<{ backgroundimage: string }>(
  ({ backgroundimage }) => ({
    backgroundImage: `url(${backgroundimage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  })
);

type ReviewPanelProps = {
  backgroundImage: string;
  quote: string;
  name: string;
  location: string;
  rating: number;
  onPrev?: () => void;
  onNext?: () => void;
};

export const ReviewPanel = ({
  backgroundImage,
  quote,
  name,
  location,
  rating,
  onPrev,
  onNext,
}: ReviewPanelProps) => (
  <ReviewWrapper backgroundimage={backgroundImage}>
    <StyledPaper>
      <Box sx={{ display: 'flex', direction: 'row' }}>
        <Typography variant="h4" component="p">
          “ {quote} ”
        </Typography>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: '15px',
          }}
        >
          <SwiperContainer onClick={onPrev}>
            <ArrowBackIosIcon fontSize="small" sx={{ color: '#0D0D0D' }} />
          </SwiperContainer>
          <SwiperContainer onClick={onNext}>
            <ArrowForwardIosIcon fontSize="small" sx={{ color: '#0D0D0D' }} />
          </SwiperContainer>
        </Stack>
      </Box>

      <Stack spacing={1} alignItems="center" sx={{ margin: '16px 0 4px' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h4">{name}</Typography>
          <Rating value={rating} readOnly size="large" />
        </Stack>
      </Stack>

      <Typography variant="caption" sx={{ fontSize: '18px' }}>
        {location}
      </Typography>
    </StyledPaper>
  </ReviewWrapper>
);
