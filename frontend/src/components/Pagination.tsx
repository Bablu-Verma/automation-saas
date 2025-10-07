import { FaChevronLeft, FaChevronRight, FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showPageNumbers = true,
  compact = false 
}) => {
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

  const getVisiblePages = () => {
    if (compact || totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      end = 5;
    } else if (currentPage >= totalPages - 2) {
      start = totalPages - 4;
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
      {/* Mobile Compact View */}
      <div className="flex sm:hidden items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={handlePrevious}
          className={`p-3 rounded-lg font-semibold transition-all duration-200 ${
            currentPage === 1
              ? "bg-gray-600 cursor-not-allowed text-gray-400"
              : "bg-primary hover:bg-secondary text-white"
          }`}
          aria-label="Previous page"
        >
          <FaChevronLeft size={16} />
        </button>

        <span className="text-gray-300 font-medium px-4 py-2 bg-gray-700 rounded-lg">
          {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={handleNext}
          className={`p-3 rounded-lg font-semibold transition-all duration-200 ${
            currentPage === totalPages
              ? "bg-gray-600 cursor-not-allowed text-gray-400"
              : "bg-primary hover:bg-secondary text-white"
          }`}
          aria-label="Next page"
        >
          <FaChevronRight size={16} />
        </button>
      </div>

      {/* Desktop Full View */}
      <div className="hidden sm:flex items-center gap-2">
        {/* First Page Button */}
        {totalPages > 5 && currentPage > 3 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-4 py-2 rounded-lg font-semibold bg-primary hover:bg-secondary text-white transition-all duration-200"
              aria-label="First page"
            >
              1
            </button>
            {currentPage > 4 && (
              <span className="px-2 text-gray-400">...</span>
            )}
          </>
        )}

        {/* Page Numbers */}
        {showPageNumbers && visiblePages.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              currentPage === pageNum
                ? "bg-secondary text-white"
                : "bg-primary hover:bg-secondary text-white"
            }`}
            aria-label={`Page ${pageNum}`}
            aria-current={currentPage === pageNum ? 'page' : undefined}
          >
            {pageNum}
          </button>
        ))}

        {/* Last Page Indicator */}
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <span className="px-2 text-gray-400">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-4 py-2 rounded-lg font-semibold bg-primary hover:bg-secondary text-white transition-all duration-200"
              aria-label="Last page"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2 ml-2">
          <button
            disabled={currentPage === 1}
            onClick={handlePrevious}
            className={`p-2 rounded-lg font-semibold transition-all duration-200 ${
              currentPage === 1
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-primary hover:bg-secondary text-white"
            }`}
            aria-label="Previous page"
          >
            <FaAngleLeft size={18} />
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={handleNext}
            className={`p-2 rounded-lg font-semibold transition-all duration-200 ${
              currentPage === totalPages
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-primary hover:bg-secondary text-white"
            }`}
            aria-label="Next page"
          >
            <FaAngleRight size={18} />
          </button>
        </div>
      </div>

      {/* Page Info */}
      <div className="text-gray-300 font-medium text-sm">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;