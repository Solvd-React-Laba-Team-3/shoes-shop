import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReviewPanel } from './ReviewPanel';

const ReviewWrapper = styled(Box)<{ backgroundimage: string }>(
  ({ backgroundimage }) => ({
    backgroundImage: `url(${backgroundimage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100%',
    width: '100%',
  })
);

type ReviewWithBackgroundProps = {
  backgroundImage: string;
  quote: string;
  name: string;
  location: string;
  rating: number;
  onPrev?: () => void;
  onNext?: () => void;
};

export const ReviewWithBackground = ({
  backgroundImage,
  ...reviewProps
}: ReviewWithBackgroundProps) => (
  <ReviewWrapper backgroundimage={backgroundImage}>
    <ReviewPanel {...reviewProps} />
  </ReviewWrapper>
);
