'use client';

import { FC, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, A11y, Thumbs, FreeMode } from 'swiper/modules';
import { Box } from '@mui/material';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import {
  StyledSliderContainer,
  StyledThumbsWrapper,
  StyledWrapper,
} from './productSlider.styles';
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';

type ProductImage = {
  id: number;
  url: string;
  name: string;
  alternativeText?: string | null;
};

interface ProductSliderProps {
  images: ProductImage[] | null;
  productName: string;
}

export const ProductSlider: FC<ProductSliderProps> = ({
  images,
  productName,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const hasImages = images && images.length > 0;
  const [loadedImages, setLoadedImages] = useState<number>(0);
  const [allLoaded, setAllLoaded] = useState<boolean>(false);

  const renderSlides = (isThumbs: boolean = false) => {
    const size = isThumbs ? 76 : undefined;

    if (hasImages) {
      return images!.map((image) => (
        <SwiperSlide key={image.id}>
          <Box
            sx={{
              position: 'relative',
              width: isThumbs ? size : '100%',
              height: isThumbs ? size : '100%',
            }}
          >
            {!allLoaded && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'action.disabledBackground',
                  zIndex: 1,
                  transition: 'opacity 0.3s',
                  opacity: allLoaded ? 0 : 1,
                  pointerEvents: 'none',
                }}
              />
            )}
            <Image
              src={image.url}
              alt={image.alternativeText || image.name}
              fill={!isThumbs}
              width={isThumbs ? size : undefined}
              height={isThumbs ? size : undefined}
              onLoad={handleImageLoad}
              style={{
                objectFit: 'cover',
                cursor: 'pointer',
              }}
            />
          </Box>
        </SwiperSlide>
      ));
    }

    return (
      <SwiperSlide>
        <Box
          sx={{
            position: 'relative',
            width: isThumbs ? size : '100%',
            height: isThumbs ? size : '100%',
          }}
        >
          <Image
            src="/product-placeholder.png"
            alt={`product: ${productName}`}
            fill={!isThumbs}
            width={isThumbs ? size : undefined}
            height={isThumbs ? size : undefined}
            style={{ objectFit: 'cover' }}
          />
        </Box>
      </SwiperSlide>
    );
  };

  useEffect(() => {
    if (!images || images.length === 0) return;
    if (loadedImages > 0) {
      setAllLoaded(true);
    }
  }, [loadedImages, images]);

  const handleImageLoad = () => {
    setLoadedImages((prev) => prev + 1);
  };

  return (
    <>
      <StyledSliderContainer>
        <StyledThumbsWrapper>
          <Swiper
            onSwiper={setThumbsSwiper}
            freeMode
            watchSlidesProgress
            loop
            observer
            observeParents
            observeSlideChildren
            modules={[FreeMode, Thumbs]}
            className="thumb-swiper"
            style={{ height: '100%', width: '100%' }}
            breakpoints={{
              0: { direction: 'horizontal', slidesPerView: 4, spaceBetween: 8 },
              900: {
                direction: 'vertical',
                slidesPerView: 'auto',
                spaceBetween: 8,
              },
            }}
          >
            {renderSlides(true)}
          </Swiper>
        </StyledThumbsWrapper>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <StyledWrapper>
            <div className="main-nav-prev" aria-label="Previous image">
              <ChevronLeftRounded fontSize="small" />
            </div>
            <div className="main-nav-next" aria-label="Next image">
              <ChevronRightRounded fontSize="small" />
            </div>
            <Swiper
              modules={[Navigation, A11y, Thumbs]}
              slidesPerView={1}
              spaceBetween={16}
              navigation={{
                prevEl: '.main-nav-prev',
                nextEl: '.main-nav-next',
              }}
              pagination={{ clickable: true }}
              thumbs={{ swiper: thumbsSwiper }}
              style={{ width: '100%', height: '100%' }}
            >
              {renderSlides(false)}
            </Swiper>
          </StyledWrapper>
        </Box>
      </StyledSliderContainer>
    </>
  );
};
