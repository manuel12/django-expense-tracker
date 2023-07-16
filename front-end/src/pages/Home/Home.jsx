import "./styles.css";

import React, { useState } from "react";

import AddExpenseButton from "../../components/AddExpenseButton/AddExpenseButton";
import AddBudgetButton from "../../components/AddBudgetButton/AddBudgetButton";
import TotalExpensesContainer from "../../components/TotalExpensesContainer/TotalExpensesContainer";
import Instructions from "../../components/Instructions/Instructions";
import BudgetContainer from "../../components/BudgetContainer/BudgetContainer";

const Home = () => {
  const [expenses, setExpenses] = useState();
  const [budget, setBudget] = useState();

  const lineChartData = {
    "09' Jun": 48.99,
    "18' Jun": 21.0,
    "25' Jun": 20.0,
    "02' Jul": 16.0,
    "09' Jul": 369.49,
  };

  return (
    <>
      <div className='buttons-container'>
        <AddExpenseButton />
        {!budget && <AddBudgetButton />}
      </div>

      <TotalExpensesContainer />

      {!expenses && <Instructions />}

      {budget && <BudgetContainer />}

      {/* {% endif %} {% if num_expenses < 2 %} */}

      {/* <h5 className='text-center instruction'>
        When you have 2 or more expenses your line chart will be displayed.
      </h5> */}

      {/* {% else %} */}

      {/* <!-- Line chart code --> */}
      {/* <div className='canvasContainer col-md-12'>
        <canvas
          id='total-expenses-line-chart'
          className='total-expenses-line-chart'
          data-test='total-expenses-line-chart'
        ></canvas>
      </div> */}
      {/* 
      <script>
        document.getElementById("create-expense-btn").focus();
        createCharts("homepage");
      </script> */}

      {/* {% endif %} {% if expenses %} */}

      {/*<div
        id='expense-table'
        className='expense-table'
        data-test='expense-table'
      >
        <table className='table table-striped table-hover table-bg'>
          <thead>
            <tr>
              <th scope='col'>Date</th>
              <th scope='col'>Source</th>
              <th scope='col'>Category</th>
              <th scope='col'>Content</th>
              <th scope='col'>Amount</th>
              <th scope='col'>Update</th>
              <th scope='col'>Delete</th>
            </tr>
          </thead>

          <tbody data-test='expense-table-body'>
            {{% for expense in expenses %}
      <tr>
        <td>{{ expense.get_date_without_time }}</td>
        <td>{{ expense.source }}</td>
        <td>{{ expense.category }}</td>
        <td>{{ expense.content }}</td>
        <td>€ {{ expense.amount }}</td>
        <td className="font-weight-bold">
          <a
            href="{% url 'expenses:update' expense.pk %}"
            data-test="update-expense-{{ expense.pk }}"
          >
            <span className="badge-pill badge-warning">✎</span>
          </a>
        </td>
        <td className="font-weight-bold">
          <a
            href="{% url 'expenses:delete' expense.pk %}"
            data-test="delete-expense-{{ expense.pk }}"
          >
            <span className="badge-pill badge-danger">X</span>
          </a>
        </td>
      </tr>
      {% endfor %} }
          </tbody>
        </table>
      </div> */}

      {/* {% endif %} {% if expenses.has_other_pages %} */}
      {/* 
      <nav id='pagination-container'>
        <ul className='pagination' data-test='pagination'>
          {% if expenses.has_previous %}

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

          {{% else %}}

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

          {% endif %} {% for i in expenses.paginator.page_range %}

          <!-- show me pages that are no more than 5 pages below or above the current page. -->
    {% if i > pagination_range_down and i < pagination_range_up %} {% if
    expenses.number == i %}

          <li
            className='active page-link page-item'
            data-test='page-link-{{i}}'
          >
            {{ i }}
          </li>

          {% else %}

          <li className='page-item'>
            <a
              className='page-link'
              data-test='page-link-{{i}}'
              href='?page={{ i }}'
            >
              {{ i }}
            </a>
          </li>

          {% endif %} {% endif %} {% endfor %} {% if expenses.has_next %}

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

          {% else %}

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

          {% endif %}
        </ul>
      </nav> */}
    </>
  );
};

export default Home;
