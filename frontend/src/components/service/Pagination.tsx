import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  perPage: number;
  onChangePerPage: (count: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onChangePage,
  perPage,
  onChangePerPage,
}: Props) => {
  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
      {/* Per Page Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">العناصر لكل صفحة:</span>
        <select
          value={perPage}
          onChange={(e) => onChangePerPage(Number(e.target.value))}
          className="px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
        >
          {[3, 6, 9, 12].map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChangePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onChangePage(page)}
            className={`px-3.5 py-1.5 border rounded-lg transition-all ${
              currentPage === page
                ? "bg-blue-500 border-blue-500 text-white"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onChangePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(Pagination);