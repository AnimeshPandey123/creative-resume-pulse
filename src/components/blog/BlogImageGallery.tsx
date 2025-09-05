import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface BlogImageGalleryProps {
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
}

const BlogImageGallery: React.FC<BlogImageGalleryProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden cursor-pointer"
            onClick={() => openModal(index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={300}
              height={200}
              className="w-full h-48 object-cover transition-transform hover:scale-105"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          <div className="relative max-w-4xl w-full h-[70vh] flex justify-center items-center">
            <Image
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />

            <button
              onClick={e => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={e => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {images[currentImageIndex].caption && (
            <p className="text-white mt-4 max-w-2xl text-center">
              {images[currentImageIndex].caption}
            </p>
          )}

          <p className="text-gray-300 mt-2">
            {currentImageIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogImageGallery;
