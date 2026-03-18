import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const getPages = () => {
    const pages: number[] = [];

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10">

      {/* Previous */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-black/10 dark:border-white/10 
                   text-textLight dark:text-textDark
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FaAngleLeft size={14} />
      </button>

      {/* Page Numbers */}
      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1.5 text-sm rounded-md border
            ${
              currentPage === page
                ? "bg-textLight text-white dark:bg-textDark dark:text-black border-transparent"
                : "border-black/10 dark:border-white/10 text-textLight dark:text-textDark"
            }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border border-black/10 dark:border-white/10 
                   text-textLight dark:text-textDark
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FaAngleRight size={14} />
      </button>
    </div>
  );
};

export default Pagination;