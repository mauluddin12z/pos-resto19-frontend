import React from "react";
import { PaginationPropsInterface } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Pagination({
  totalPages,
  currentPage,
  hasNextPage,
  isLoading,
  onPageChange,
}: PaginationPropsInterface) {
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );
  const handlePageChange = (page: number) => {
    if (isLoading || page === currentPage) return;
    onPageChange(page);
  };
  if (isLoading) {
    return (
      <ul className="inline-flex -space-x-px">
        {/* Prev Page */}
        <li>
          <button
            className="w-10 h-10 leading-tight bg-white border border-gray-300 rounded-l-lg text-gray-400"
            disabled
          >
            <ArrowLeft />
          </button>
        </li>

        {/* Page Numbers */}
        <li>
          <button
            className="w-10 h-10 leading-tight text-gray-400 bg-white border border-gray-300"
            disabled
          >
            1
          </button>
        </li>

        {/* Next Page */}
        <li>
          <button
            className="w-10 h-10 leading-tight bg-white border border-gray-300 rounded-r-lg text-gray-400"
            disabled
          >
            <ArrowRight />
          </button>
        </li>
      </ul>
    );
  }

  return (
    <div className="flex justify-center items-center gap-x-2">
      <ul className="inline-flex -space-x-px">
        {/* Prev Page */}
        <li>
          <button
            aria-label="previousPage"
            disabled={currentPage <= 1}
            className={`w-10 h-10 flex justify-center items-center leading-tight bg-white border border-gray-300 rounded-l-lg ${
              currentPage <= 1
                ? "text-gray-400"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer disabled:cursor-not-allowed"
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ArrowLeft />
          </button>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((page) => (
          <li key={page}>
            <button
              className={`${
                currentPage === page
                  ? "text-white border border-gray-300 bg-blue-500"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              } w-10 h-10 flex justify-center items-center leading-tight cursor-pointer`}
              onClick={() => handlePageChange(page)}
              disabled={isLoading}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Next Page */}
        <li>
          <button
            aria-label="nextPage"
            disabled={!hasNextPage}
            className={`w-10 h-10 flex justify-center items-center leading-tight bg-white border border-gray-300 rounded-r-lg ${
              !hasNextPage
                ? "text-gray-400"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer disabled:cursor-not-allowed "
            } `}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ArrowRight />
          </button>
        </li>
      </ul>
    </div>
  );
}
