import React, { useState, useCallback } from 'react';
import { Worker } from 'twilio-taskrouter';
import { Box } from '@twilio-paste/core/box';
import {
  Pagination,
  PaginationItems,
  PaginationArrow,
  PaginationNumbers,
  PaginationNumber,
  PaginationEllipsis,
} from '@twilio-paste/core/pagination';
import {
  DataGrid,
  DataGridHead,
  DataGridRow,
  DataGridHeader,
  DataGridBody,
  DataGridCell,
} from '@twilio-paste/core/data-grid';

const getRange = (start: number, end: number): number[] => {
  return [...new Array(end - start + 1)].map((_, index) => index + start);
};

/* Calculates the correct display of the pagination numbers */
const calculatePaginationState = (currentPage: number, pageCount: number): number[] => {
  let delta;
  if (pageCount <= 7) {
    // delta === 7: [1 2 3 4 5 6 7]
    delta = 7;
  } else {
    // delta === 2: [1 ... 4 5 6 ... 10]
    // delta === 4: [1 2 3 4 5 ... 10]
    delta = currentPage > 4 && currentPage < pageCount - 3 ? 2 : 4;
  }

  let rangeStart = Math.round(currentPage - delta / 2);
  let rangeEnd = Math.round(currentPage + delta / 2);

  if (rangeStart - 1 === 1 || rangeEnd + 1 === pageCount) {
    rangeStart += 1;
    rangeEnd += 1;
  }

  let pages =
    currentPage > delta
      ? getRange(Math.min(rangeStart, pageCount - delta), Math.min(rangeEnd, pageCount))
      : getRange(1, Math.min(pageCount, delta + 1));

  // eslint-disable-next-line no-negated-condition
  const withDots = (value: number, pair: number[]): number[] => (pages.length + 1 !== pageCount ? pair : [value]);

  if (pages[0] !== 1) {
    pages = withDots(1, [1, -1]).concat(pages);
  }

  if (pages[pages.length - 1] < pageCount) {
    pages = pages.concat(withDots(pageCount, [-1, pageCount]));
  }

  return pages;
};

interface DataGridPaginationProps {
  currentPage?: number;
  pageCount: number;
  onPageChange: (newPageNumber: number) => void;
}

const DataGridPagination: React.FC<DataGridPaginationProps> = ({ currentPage = 1, pageCount, onPageChange }) => {
  const goToNextPage = useCallback(() => {
    onPageChange(Math.min(currentPage + 1, pageCount));
  }, [currentPage, pageCount]);

  const goToPreviousPage = useCallback(() => {
    onPageChange(Math.max(currentPage - 1, 1));
  }, [currentPage]);

  const goToPage = useCallback((pageNumber: number) => {
    onPageChange(pageNumber);
  }, []);

  const paginationState = calculatePaginationState(currentPage, pageCount);

  return (
    <Pagination label="paged pagination navigation">
      <PaginationItems>
        <PaginationArrow
          label="Go to previous page"
          variant="back"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        />
        <PaginationNumbers>
          {paginationState.map((pageNumber, pageIndex) => {
            if (pageNumber === -1) {
              return <PaginationEllipsis key={`pagination-number-${pageIndex}`} label="Collapsed previous pages" />;
            }

            return (
              <PaginationNumber
                label={`Go to page ${pageNumber}`}
                isCurrent={currentPage === pageNumber}
                onClick={() => {
                  goToPage(pageNumber);
                }}
                key={`pagination-number-${pageIndex}`}
              >
                {pageNumber}
              </PaginationNumber>
            );
          })}
        </PaginationNumbers>
        <PaginationArrow
          label="Go to next page"
          variant="forward"
          onClick={goToNextPage}
          disabled={currentPage === pageCount}
        />
      </PaginationItems>
    </Pagination>
  );
};

interface Props {
  targets: Map<string, Worker> | undefined;
}

const PreviewBroadcastTargets = ({ targets }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 5;
  const TOTAL_ROWS = targets?.size || 0;
  const TOTAL_PAGES = Math.ceil(TOTAL_ROWS / PAGE_SIZE);
  const rowIndexStart = (currentPage - 1) * PAGE_SIZE;
  const rowIndexEnd = Math.min(rowIndexStart + PAGE_SIZE - 1, TOTAL_ROWS);

  const handlePagination = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  if (targets === undefined) {
    return null;
  }

  return (
    <>
      <DataGrid aria-label="example grid">
        <DataGridHead>
          <DataGridRow>
            <DataGridHeader>Agent</DataGridHeader>
          </DataGridRow>
        </DataGridHead>
        <DataGridBody>
          {Array.from(targets.values())
            .filter((_, rowIndex) => {
              return rowIndex >= rowIndexStart && rowIndex <= rowIndexEnd;
            })
            .map((worker, index) => {
              const rowIndex = index + rowIndexStart;
              return (
                <DataGridRow key={`row-${rowIndex}`}>
                  <DataGridCell>{worker.friendlyName}</DataGridCell>
                </DataGridRow>
              );
            })}
        </DataGridBody>
      </DataGrid>
      <Box display="flex" justifyContent="center" marginTop="space70">
        <DataGridPagination currentPage={currentPage} pageCount={TOTAL_PAGES} onPageChange={handlePagination} />
      </Box>
    </>
  );
};

export default PreviewBroadcastTargets;
