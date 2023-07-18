import "./styles.css";

import React, { useState } from "react";

const StatisticsTable = ({data}) => {
  const [budget, setBudget] = useState(20);

  const [currentMonthExpenseSum, setCurentMonthExpenseSum] = useState(101.99);
  const [oneMonthAgoExpenseSum, setOneMonthAgoExpenseSum] = useState(87.99);

  const [monthlyPercentageDiff, setMonthlyPercentageDiff] = useState(115.91);
  const [monthlyExpenseAverage, setMonthlyExpenseAverage] = useState(84.4);

  const [dailyExpenseAverage, setDailyExpenseAverage] = useState(14.68);

  const [biggestCategoryExpenseCategory, setBiggestCategoryExpenseCategory] =
    useState("Monthly bill");

  const [biggestCategoryExpenseAmount, setBiggestCategoryExpenseAmount] =
    useState(139.96);

  const [smallestCategoryExpenseCategory, setSmallestCategoryExpenseCategory] =
    useState("Electronics");
  const [smallestCategoryExpenseAmount, setSmallestCategoryExpenseAmount] =
    useState(13.0);

  const [maxExpenseContent, setMaxExpenseContent] = useState("Gym memebership");
  const [maxExpense, setMaxExpense] = useState(25.0);

  const [minExpenseContent, setMinExpenseContent] = useState("Ice Cream");
  const [minExpense, setMinExpense] = useState(4.0);

  const [sumExpense, setSumExpense] = useState(337.62);

  return (
    <div
      id='statistics-table'
      className='statistics-table'
      data-test='statistics-table'
    >
      <div className='row'>
        <div className='col-md-12'>
          <table className='w-100 table-striped table-hover table-bg'>
            <tbody>
              <tr>
                <td>Current month's total expenses:</td>
                <td
                  className='statistics'
                  data-test='stats-current-month-expenses'
                >
                  {`€ ${currentMonthExpenseSum} / € ${budget} `}

                  {budget > currentMonthExpenseSum ? (
                    <span className='badge badge-pill badge-success'>
                      {" "}
                      under budget{" "}
                    </span>
                  ) : (
                    <span className='badge badge-pill badge-danger'>
                      {" "}
                      over budget{" "}
                    </span>
                  )}

                  <a
                    href="{% url 'expenses:update_budget' %}"
                    className='font-weight-bold'
                    data-test='update-budget'
                  >
                    <span className='badge-pill badge-warning'>✎</span>
                  </a>
                  <a
                    href="{% url 'expenses:delete_budget' %}"
                    className='font-weight-bold'
                    data-test='delete-budget'
                  >
                    <span className='badge-pill badge-danger'>X</span>
                  </a>
                </td>
              </tr>
              <tr>
                <td>Last month's total expenses:</td>
                <td
                  className='statistics'
                  data-test='stats-last-month-expenses'
                >
                  {`€ ${oneMonthAgoExpenseSum}`}
                </td>
              </tr>
              <tr>
                <td>Current Month vs Last Month's (%) comparison:</td>
                <td
                  className='statistics'
                  data-test='stats-current-month-vs-last-month-comparison'
                >
                  {monthlyPercentageDiff === 0 && <span> 0% </span>}
                  {monthlyPercentageDiff > 100 ? (
                    <span className='badge badge-pill badge-danger'>
                      {" "}
                      {monthlyPercentageDiff}%{" "}
                    </span>
                  ) : (
                    <span className='badge badge-pill badge-success'>
                      {monthlyPercentageDiff}%
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td>Monthly expense average:</td>
                <td
                  className='statistics'
                  data-test='stats-monthly-expense-average'
                >
                  € {monthlyExpenseAverage}
                </td>
              </tr>

              <tr>
                <td>Daily expense average:</td>
                <td
                  className='statistics'
                  data-test='stats-daily-expense-average'
                >
                  € {dailyExpenseAverage}
                </td>
              </tr>
              <tr>
                <td>Biggest category expenditure:</td>
                <td
                  className='statistics'
                  data-test='stats-biggest-category-expense'
                >
                  {biggestCategoryExpenseCategory}
                  <p className='black-font'>€ {biggestCategoryExpenseAmount}</p>
                </td>
              </tr>
              <tr>
                <td>Smallest category expenditure:</td>
                <td
                  className='statistics'
                  data-test='stats-smallest-category-expense'
                >
                  {smallestCategoryExpenseCategory}
                  <p className='black-font'>
                    € {smallestCategoryExpenseAmount}
                  </p>
                </td>
              </tr>
              <tr>
                <td>Biggest expense:</td>
                <td className='statistics' data-test='stats-biggest-expense'>
                  {(maxExpenseContent)}
                  <p className='black-font'>€ {maxExpense}</p>
                </td>
              </tr>
              <tr>
                <td>Smallest expense:</td>
                <td className='statistics' data-test='stats-smallest-expense'>
                {(minExpenseContent)}
                  <p className='black-font'>€ {minExpense}</p>
                </td>
              </tr>
              <tr className='font-weight-bold'>
                <td>Total expenses:</td>
                <td className='statistics' data-test='stats-total-expenses'>
                  € {sumExpense}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatisticsTable;
