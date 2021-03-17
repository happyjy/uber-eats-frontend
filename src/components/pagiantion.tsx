import React from "react";

interface IPagination {
  onPrevPageClick(): void;
  onNextPageClick(): void;
  page: number;
  totalPages: number | null | undefined;
}

export const Pagination: React.FC<IPagination> = ({
  onPrevPageClick,
  onNextPageClick,
  page,
  totalPages,
}) => {
  return (
    <div className="max-w-md grid grid-cols-3 text-center mx-auto mt-10">
      {page > 1 ? (
        <button onClick={onPrevPageClick} className="">
          &larr;
        </button>
      ) : (
        <div></div>
      )}
      <span>
        {" "}
        Page {page} of {totalPages}
      </span>
      {page !== totalPages ? (
        <button onClick={onNextPageClick} className="">
          &rarr;
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
};
