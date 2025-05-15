import Page from "../../store/models/page";

interface PaginationProps {
  page: Page;
  onPageChange: (pageIndex: number) => void;
}

const Pagination = (props: PaginationProps) => {
  const {
    page: { totalPages, pageIndex, hasPreviousPage, hasNextPage },
    onPageChange,
  } = props;

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(pageIndex - 1)}
        disabled={!hasPreviousPage}
        className="px-4 py-2 text-white rounded-lg disabled:opacity-50"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-full ${
            pageIndex === page
              ? "bg-gray text-primary"
              : "bg-primary text-white"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(pageIndex + 1)}
        disabled={!hasNextPage}
        className="px-4 py-2 text-white rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
