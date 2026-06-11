'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface BlogPaginationProps {
  totalPages: number;
  currentPage: number;
}

const BlogPagination: React.FC<BlogPaginationProps> = ({
  totalPages,
  currentPage,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(
      searchParams ? searchParams.toString() : ''
    );
    newParams.set('page', page.toString());
    router.push(`/blog/?${newParams.toString()}`);

    // Scroll to top when changing pages
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Don't render pagination if only one page
  if (totalPages <= 1) return null;

  // Create array of pages to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few of them
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include the first page
      pages.push(1);

      // Add middle pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }

      // Always include the last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={
              currentPage === 1
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {getPageNumbers().map((pageNumber, index) => {
          // If pageNumber is negative, it's an ellipsis
          if (pageNumber < 0) {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={pageNumber === currentPage}
                onClick={() => handlePageChange(pageNumber)}
                className="cursor-pointer"
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
            className={
              currentPage === totalPages
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default BlogPagination;
