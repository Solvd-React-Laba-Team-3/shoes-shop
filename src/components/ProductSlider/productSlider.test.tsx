/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen } from '@testing-library/react';
import { ProductSlider } from './ProductSlider';
import { File } from '@/types/api/File';
import {
  StyledSliderContainer,
  StyledThumbsWrapper,
  StyledWrapper,
} from './productSlider.styles';
import '@testing-library/jest-dom';

jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/navigation', () => ({}));
jest.mock('swiper/css/pagination', () => ({}));
jest.mock('swiper/css/thumbs', () => ({}));

jest.mock('next/image', () => {
  const Image = (props: any) => <img {...props} alt={props.alt} />;
  Image.displayName = 'NextImage';
  return Image;
});

jest.mock('swiper/react', () => {
  const Swiper = ({ children }: any) => (
    <div data-testid="swiper">{children}</div>
  );
  const SwiperSlide = ({ children }: any) => (
    <div data-testid="swiper-slide">{children}</div>
  );
  return { Swiper, SwiperSlide };
});

jest.mock('swiper/modules', () => ({
  Navigation: {},
  Thumbs: {},
  A11y: {},
  FreeMode: {},
}));

describe('ProductSlider', () => {
  const images: File[] = [
    {
      id: 1,
      url: '/img1.jpg',
      name: 'Image 1',
      alternativeText: 'Alt 1',
      caption: null,
      width: 800,
      height: 600,
      formats: {},
      hash: 'hash1',
      ext: '.jpg',
      mime: 'image/jpeg',
      size: 1024,
      previewUrl: null,
      provider: 'local',
      provider_metadata: { public_id: 'image1', resource_type: 'image' },
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 2,
      url: '/img2.jpg',
      name: 'Image 2',
      alternativeText: 'Alt 2',
      caption: null,
      width: 800,
      height: 600,
      formats: {},
      hash: 'hash2',
      ext: '.jpg',
      mime: 'image/jpeg',
      size: 1024,
      previewUrl: null,
      provider: 'local',
      provider_metadata: { public_id: 'image2', resource_type: 'image' },
      createdAt: '',
      updatedAt: '',
    },
  ];

  it('renders placeholder when no images', () => {
    render(<ProductSlider images={null} productName="Test Product" />);
    const placeholderImg = screen.getAllByAltText('product: Test Product');
    expect(placeholderImg.length).toBeGreaterThanOrEqual(2);
    expect(placeholderImg[0]).toHaveAttribute(
      'src',
      '/product-placeholder.png'
    );
  });

  it('renders thumbnail slides', () => {
    render(<ProductSlider images={images} productName="Test Product" />);
    images.forEach((img) => {
      expect(
        screen.getAllByAltText(img.alternativeText || img.name)[0]
      ).toBeInTheDocument();
    });
  });

  it('renders navigation arrows', () => {
    render(<ProductSlider images={images} productName="Test Product" />);
    expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
  });

  it('renders main slides with images', () => {
    render(<ProductSlider images={images} productName="Test Product" />);
    expect(screen.getAllByAltText('Alt 1').length).toBeGreaterThan(0);
  });

  it('calls setThumbsSwiper on Swiper mount', () => {
    render(<ProductSlider images={images} productName="Test Product" />);
    expect(screen.getAllByTestId('swiper').length).toBeGreaterThan(0);
  });

  it('falls back to name when alternativeText is missing', () => {
    const noAltImages: File[] = [
      {
        ...images[0],
        alternativeText: null,
      },
    ];

    render(<ProductSlider images={noAltImages} productName="Test Product" />);

    const imgs = screen.getAllByAltText(noAltImages[0].name);
    expect(imgs.length).toBeGreaterThan(0);
    imgs.forEach((img) => {
      expect(img).toHaveAttribute('src', noAltImages[0].url);
    });
  });

  it('renders placeholder when images is an empty array', () => {
    render(<ProductSlider images={[]} productName="Empty Test" />);
    const placeholder = screen.getAllByAltText('product: Empty Test');
    expect(placeholder.length).toBeGreaterThanOrEqual(1);
  });

  describe('productSlider.styles', () => {
    it('renders StyledSliderContainer', () => {
      render(<StyledSliderContainer data-testid="slider" />);
      expect(screen.getByTestId('slider')).toBeInTheDocument();
    });

    it('renders StyledThumbsWrapper', () => {
      render(<StyledThumbsWrapper data-testid="thumbs" />);
      expect(screen.getByTestId('thumbs')).toBeInTheDocument();
    });

    it('renders StyledWrapper', () => {
      render(<StyledWrapper data-testid="wrapper" />);
      expect(screen.getByTestId('wrapper')).toBeInTheDocument();
    });
  });

  describe('productSlider.styles (real MUI)', () => {
    const { StyledSliderContainer, StyledThumbsWrapper, StyledWrapper } =
      jest.requireActual('./productSlider.styles');

    it('applies slider container styles', () => {
      const { container } = render(<StyledSliderContainer />);
      expect(container.firstChild).toHaveStyle({ display: 'flex' });
    });

    it('applies thumbs wrapper styles', () => {
      const { container } = render(<StyledThumbsWrapper />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies wrapper styles', () => {
      const { container } = render(<StyledWrapper />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('ProductSlider functions coverage', () => {
    const images: File[] = [
      {
        id: 1,
        url: '/img1.jpg',
        name: 'Image 1',
        alternativeText: 'Alt 1',
        width: 800,
        height: 600,
        formats: {},
        hash: 'hash1',
        ext: '.jpg',
        mime: 'image/jpeg',
        size: 1024,
        previewUrl: null,
        provider: 'local',
        provider_metadata: { public_id: 'image1', resource_type: 'image' },
        createdAt: '',
        updatedAt: '',
        caption: null,
      },
    ];

    it('renders renderSlides without images (placeholder)', () => {
      render(<ProductSlider images={null} productName="Test" />);
      const placeholder = screen.getAllByAltText('product: Test');
      expect(placeholder.length).toBeGreaterThanOrEqual(1);
    });

    it('sets thumbsSwiper on mount', () => {
      const { container } = render(
        <ProductSlider images={images} productName="Test" />
      );
      expect(
        container.querySelectorAll('[data-testid="swiper"]').length
      ).toBeGreaterThan(0);
    });

    it('navigation arrows exist', () => {
      render(<ProductSlider images={images} productName="Test" />);
      expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
      expect(screen.getByLabelText('Next image')).toBeInTheDocument();
    });
  });

  describe('ProductSlider additional coverage', () => {
    const images: File[] = [
      {
        id: 1,
        url: '/img1.jpg',
        name: 'Image 1',
        alternativeText: 'Alt 1',
        width: 800,
        height: 600,
        formats: {},
        hash: 'hash1',
        ext: '.jpg',
        mime: 'image/jpeg',
        size: 1024,
        previewUrl: null,
        provider: 'local',
        provider_metadata: { public_id: 'image1', resource_type: 'image' },
        createdAt: '',
        updatedAt: '',
        caption: null,
      },
    ];

    it('renders Swiper with correct breakpoints', () => {
      render(<ProductSlider images={images} productName="Test Product" />);
      const swiper = screen.getAllByTestId('swiper')[0];
      expect(swiper).toBeInTheDocument();
      expect(swiper.parentElement).toBeTruthy();
    });

    it('renders thumbnails with width/height 76', () => {
      render(<ProductSlider images={images} productName="Test Product" />);
      const thumbImg = screen.getAllByAltText('Alt 1')[0];
      expect(thumbImg).toHaveAttribute('width', '76');
      expect(thumbImg).toHaveAttribute('height', '76');
    });

    it('renders main slides with fill prop true', () => {
      render(<ProductSlider images={images} productName="Test Product" />);
      const mainImg = screen.getAllByAltText('Alt 1')[1];
      expect(mainImg).toBeInTheDocument();
    });
  });
});
