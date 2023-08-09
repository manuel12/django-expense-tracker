import "./styles.css";

import React, { useState, useEffect } from "react";
import { API } from "../../api-service";

const Pagination = ({ setExpenses }) => {
  const [accessToken] = useState(JSON.parse(localStorage.getItem("accessToken")));

  const [numPages, setNumPages] = useState(0);
  const [paginationSuffix, setPaginationSuffix] = useState(1);

  const [currentPage, setCurrentPage] = useState(paginationSuffix);

  const [previousPageAvailable, setPreviousPageAvailable] = useState(false);
  const [nextPageAvailable, setNextPageAvailable] = useState(false);

  useEffect(() => {
    API.fetchPaginatedExpenses({
      accessToken,
      paginationSuffix,
      setExpenses,
      setPreviousPageAvailable,
      setNextPageAvailable,
      numPages,
      setNumPages,
    });
  }, [paginationSuffix]);

  useEffect(() => {
    setCurrentPage(paginationSuffix);
  }, [paginationSuffix]);

  const handlePaginationClick = (pageNum) => {
    setPaginationSuffix(pageNum);
  };

  return (
    numPages > 0 && (
      <nav id='pagination-container'>
        <ul className='pagination' data-test='pagination'>
          {previousPageAvailable ? (
            <>
              <li
                className='page-item pagination-link'
                data-test='first-button'
              >
                <a
                  className='page-link'
                  onClick={() => {
                    handlePaginationClick(1);
                  }}
                >
                  First
                </a>
              </li>
              <li
                className='page-item pagination-link'
                data-test='previous-button'
              >
                <a
                  className='page-link'
                  onClick={() => {
                    handlePaginationClick(paginationSuffix - 1);
                  }}
                >
                  Previous
                </a>
              </li>
            </>
          ) : (
            <>
              <li className='disabled page-item' data-test='first-button'>
                <a className='page-link'>
                  First
                </a>
              </li>
              <li className='disabled page-item' data-test='previous-button'>
                <a className='page-link'>
                  Previous
                </a>
              </li>
            </>
          )}

          {[...Array(numPages)].map((page, i) => {
            return (
              <li
                key={i}
                className={`${
                  paginationSuffix === i + 1 ? "active" : ""
                } page-link page-item pagination-link`}
                data-test={`page-link-${i + 1}`}
                onClick={() => handlePaginationClick(i + 1)}
              >
                {`${i + 1}`}
              </li>
            );
          })}

          {nextPageAvailable ? (
            <>
              <li className='page-item pagination-link' data-test='next-button'>
                <a
                  className='page-link'
                  onClick={() => {
                    handlePaginationClick(paginationSuffix + 1);
                  }}
                >
                  Next
                </a>
              </li>
              <li className='page-item pagination-link' data-test='last-button'>
                <a
                  className='page-link'
                  onClick={() => {
                    handlePaginationClick(numPages);
                  }}
                >
                  Last
                </a>
              </li>
            </>
          ) : (
            <>
              <li className='disabled page-item' data-test='next-button'>
                <a className='page-link'>
                  Next
                </a>
              </li>
              <li className='disabled page-item' data-test='last-button'>
                <a className='page-link'>
                  Last
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    )
  );
};

export default Pagination;
