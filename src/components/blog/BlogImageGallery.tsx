
import React, { useState } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

interface BlogImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
}

const BlogImageGallery: React.FC<BlogImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!images || images.length === 0) return null;
  
  // If there's only one image, render it without carousel
  if (images.length === 1) {
    const image = images[0];
    return (
      <figure className="my-8">
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className="w-full h-auto rounded-lg"
          width={image.width}
          height={image.height}
        />
        {image.alt && <figcaption className="text-center text-sm text-muted-foreground mt-2">{image.alt}</figcaption>}
      </figure>
    );
  }
  
  return (
    <div className="my-8">
      <Carousel 
        className="w-full"
        onSelect={(idx) => setCurrentIndex(idx)}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <figure className="relative w-full h-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-auto rounded-lg"
                  width={image.width}
                  height={image.height}
                />
                {image.alt && (
                  <figcaption className="text-center text-sm text-muted-foreground mt-2">
                    {image.alt}
                  </figcaption>
                )}
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      
      <div className="flex justify-center mt-4">
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-primary'
                  : 'bg-gray-300 dark:bg-gray-700'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogImageGallery;
