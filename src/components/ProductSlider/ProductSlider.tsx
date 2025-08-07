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

  const renderSlides = (isThumbs: boolean = false) => {
    if (hasImages) {
      return images!.map((image) => (
        <SwiperSlide key={image.id}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              aspectRatio: '1 / 1',
            }}
          >
            {isThumbs ? (
              <Image
                src={image.url}
                alt={image.alternativeText || image.name}
                width={76}
                height={76}
                sizes="250px"
                priority
                style={{
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
              />
            ) : (
              <Image
                src={image.url}
                alt={image.alternativeText || image.name}
                fill
                sizes="1000px"
                priority
                style={{
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
              />
            )}
          </Box>
        </SwiperSlide>
      ));
    }

    return (
      <SwiperSlide>
        <Box
          sx={{
            position: 'relative',
            width: isThumbs ? 76 : '100%',
            height: isThumbs ? 76 : '100%',
          }}
        >
          <Image
            src="/product-placeholder.png"
            alt={`product: ${productName}`}
            fill={!isThumbs}
            width={isThumbs ? 76 : undefined}
            height={isThumbs ? 76 : undefined}
            style={{ objectFit: 'cover' }}
          />
        </Box>
      </SwiperSlide>
    );
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
              0: {
                direction: 'horizontal',
                slidesPerView: 4.5,
                spaceBetween: 8,
              },
              900: {
                direction: 'vertical',
                slidesPerView: 'auto',
                spaceBetween: 16,
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
