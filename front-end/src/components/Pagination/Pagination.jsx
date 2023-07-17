import "./styles.css";


import React from "react";

const Pagination = () => {
  const i = 1;

  return (
    // {% if expenses.has_other_pages %} */}
    <nav id='pagination-container'>
      <ul className='pagination' data-test='pagination'>
        {/* {% if expenses.has_previous %} */}

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

        {/* {{% else %}} */}

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

        {/* {% endif %} {% for i in expenses.paginator.page_range %} */}

        {/* <!-- show me pages that are no more than 5 pages below or above the current page. --> */}
        {/* {% if i > pagination_range_down and i < pagination_range_up %} {% if
expenses.number == i %} */}

        <li className='active page-link page-item' data-test='page-link-{{i}}'>
          {/* {{ i }} */}
        </li>

        {/* {% else %} */}

        <li className='page-item'>
          <a
            className='page-link'
            data-test='page-link-{{i}}'
            href='?page={{ i }}'
          >
            {/* {{ i }} */}
          </a>
        </li>

        {/* {% endif %} {% endif %} {% endfor %} {% if expenses.has_next %} */}

        <li className='page-item' data-test='next-button'>
          <a className='page-link' href='?page={{ expenses.next_page_number }}'>
            Next
          </a>
        </li>
        <li className='page-item' data-test='last-button'>
          <a className='page-link' href='?page={{ num_pages }}'>
            Last
          </a>
        </li>

        {/* {% else %} */}

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

        {/* {% endif %} */}
      </ul>
    </nav>
  );
};

export default Pagination;
