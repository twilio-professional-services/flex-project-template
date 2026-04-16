import React from 'react';
import { Pagination, PaginationItems, PaginationArrow, PaginationLabel } from '@twilio-paste/core/pagination';

export interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages === 0) {
    return null;
  }

  return (
    <Pagination label="Contact pagination">
      <PaginationItems>
        <PaginationArrow
          label="Go to previous page"
          variant="back"
          onClick={handlePrevious}
          disabled={currentPage <= 1}
        />
        <PaginationLabel>
          Page {currentPage} of {totalPages}
        </PaginationLabel>
        <PaginationArrow
          label="Go to next page"
          variant="forward"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
        />
      </PaginationItems>
    </Pagination>
  );
};

export default Paginator;
