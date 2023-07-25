import "./styles.css";

import React, { useState, useEffect } from "react";

const Pagination = ({setExpenses}) => {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );

  const [paginatedExpenses, setPaginatedExpenses] = useState({});
  const [hasOtherPages, setHasOtherPages] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [paginationSuffix, setPaginationSuffix] = useState(1);

  useEffect(() => {
    fetchExpenses();
  }, [paginationSuffix]);

  const fetchExpenses = async () => {
    const res = await fetch(
      `http://localhost:8000/api/expenses/?page=${paginationSuffix}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (res.ok) {
      const paginatedExpenses = await res.json();

      setExpenses(paginatedExpenses.results)
      setPaginatedExpenses(paginatedExpenses.results);
      setHasOtherPages(paginatedExpenses?.next);
      !numPages &&
        setNumPages(
          Math.ceil(paginatedExpenses.count / paginatedExpenses.results.length)
        );
    } else {
      throw new Error("Fetching expenses failed");
    }
  };

  const handlePaginationClick = (pageNum) => {
    console.log(pageNum);
    setPaginationSuffix(pageNum);
  };

  return (
    numPages > 0 && (
      <nav id='pagination-container'>
        <ul className='pagination' data-test='pagination'>
          {paginatedExpenses.previous ? (
            <>
              <li className='page-item' data-test='first-button'>
                <a className='page-link' href='?page=1'>
                  First
                </a>
              </li>
              <li className='page-item' data-test='previous-button'>
                <a
                  className='page-link'
                  href='?page={{ expenses.previous_page_number }}'
                >
                  Previous
                </a>
              </li>
            </>
          ) : (
            <>
              <li className='disabled page-item' data-test='first-button'>
                <a className='page-link' href=''>
                  First
                </a>
              </li>
              <li className='disabled page-item' data-test='previous-button'>
                <a className='page-link' href=''>
                  Previous
                </a>
              </li>
            </>
          )}

          {/* {% for i in expenses.paginator.page_range %} */}

          {/* <!-- show me pages that are no more than 5 pages below or above the current page. --> */}
          {/* {% if i > pagination_range_down and i < pagination_range_up %} {% if
expenses.number == i %} */}
          {[...Array(numPages)].map((page, i) => {
            return (
              <li
                key={i}
                className='active page-link page-item pagination-link'
                data-test={`page-link-${i + 1}`}
                onClick={() => handlePaginationClick(i + 1)}
              >
                {`${i + 1}`}
              </li>
            );
          })}

          {/* {% else %} */}

          {/* // <li className='page-item'>
          //   <a
          //     className='page-link'
          //     data-test={`page-link-${i}`}
          //     href={`?page=${i}`}
          //   >
          //    {`${i}`}
          //   </a>
          // </li> */}

          {/* {% endif %} {% endif %} {% endfor %} */}

          {paginatedExpenses.next ? (
            <>
              <li className='page-item' data-test='next-button'>
                <a
                  className='page-link'
                  href='?page={{ expenses.next_page_number }}'
                >
                  Next
                </a>
              </li>
              <li className='page-item' data-test='last-button'>
                <a className='page-link' href='?page={{ num_pages }}'>
                  Last
                </a>
              </li>
            </>
          ) : (
            <>
              <li className='disabled page-item' data-test='next-button'>
                <a className='page-link' href=''>
                  Next
                </a>
              </li>
              <li className='disabled page-item' data-test='last-button'>
                <a className='page-link' href=''>
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
