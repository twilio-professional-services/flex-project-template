import { templates, Template } from '@twilio/flex-ui';
import { Pagination, PaginationItems, PaginationArrow, PaginationLabel } from '@twilio-paste/core/pagination';

import { StringTemplates } from '../flex-hooks/strings';

export interface OwnProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

const Paginator = ({ currentPage, totalPages, goToPage }: OwnProps) => {
  const goToNextPage = () => {
    goToPage(Math.min(currentPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    goToPage(Math.max(currentPage - 1, 1));
  };

  return (
    <Pagination label="Pagination">
      <PaginationItems>
        <PaginationArrow
          label={templates[StringTemplates.PreviousPage]()}
          variant="back"
          onClick={goToPreviousPage}
          disabled={currentPage <= 1 || totalPages < 1}
        />
        <PaginationLabel>
          {totalPages < 1 ? (
            <Template source={templates[StringTemplates.NoItems]} />
          ) : (
            <Template source={templates[StringTemplates.CurrentPage]} current={currentPage} total={totalPages} />
          )}
        </PaginationLabel>
        <PaginationArrow
          label={templates[StringTemplates.NextPage]()}
          variant="forward"
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
        />
      </PaginationItems>
    </Pagination>
  );
};

export default Paginator;
