import "./styles.css";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StatisticsTable = ({ budgetData, statisticsData }) => {
  const navigate = useNavigate();

  const [budget] = useState(budgetData);

  const [currentMonthExpenseSum] = useState(
    statisticsData.curr_month_expense_sum
  );
  const [oneMonthAgoExpenseSum] = useState(
    statisticsData.one_month_ago_expense_sum
  );

  const [monthlyPercentageDiff] = useState(
    statisticsData.monthly_percentage_diff
  );
  const [monthlyExpenseAverage] = useState(
    statisticsData.monthly_expense_average
  );

  const [dailyExpenseAverage] = useState(statisticsData.daily_expense_average);

  const [biggestCategoryExpenseCategory] = useState(
    statisticsData.biggest_category_expenditure?.category
  );

  const [biggestCategoryExpenseAmount] = useState(
    statisticsData.biggest_category_expenditure?.amount
  );

  const [smallestCategoryExpenseCategory] = useState(
    statisticsData.smallest_category_expenditure?.category
  );
  const [smallestCategoryExpenseAmount] = useState(
    statisticsData.smallest_category_expenditure?.amount
  );

  const [maxExpenseContent] = useState(statisticsData.max_expense_content);
  const [maxExpense] = useState(statisticsData.max_expense);

  const [minExpenseContent] = useState(statisticsData.min_expense_content);
  const [minExpense] = useState(statisticsData.min_expense);

  const [sumExpense] = useState(statisticsData.sum_expense);

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
                  {`€ ${currentMonthExpenseSum}`}

                  {budget?.amount && (
                    <>
                      {`/ € ${budget.amount} `}
                      {budget.amount > currentMonthExpenseSum ? (
                        <span className='badge badge-pill badge-success mx-1'>
                          {" "}
                          under budget{" "}
                        </span>
                      ) : (
                        <span className='badge badge-pill badge-danger mx-1'>
                          {" "}
                          over budget{" "}
                        </span>
                      )}
                      <a
                        onClick={() => {
                          navigate(`/update-budget/${budget.id}/`)
                        }}
                        className='font-weight-bold mx-1'
                        data-test='update-budget'
                      >
                        <span className='badge-pill badge-warning'>✎</span>
                      </a>
                      <a
                        onClick={() => {
                          navigate(`/delete-budget/${budget.id}/`)
                        }}
                        className='font-weight-bold mx-1'
                        data-test='delete-budget'
                      >
                        <span className='badge-pill badge-danger'>X</span>
                      </a>
                    </>
                  )}
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
                  {biggestCategoryExpenseCategory}:
                  <p className='black-font'>€ {biggestCategoryExpenseAmount}</p>
                </td>
              </tr>
              <tr>
                <td>Smallest category expenditure:</td>
                <td
                  className='statistics'
                  data-test='stats-smallest-category-expense'
                >
                  {smallestCategoryExpenseCategory}:
                  <p className='black-font'>
                    € {smallestCategoryExpenseAmount}
                  </p>
                </td>
              </tr>
              <tr>
                <td>Biggest expense:</td>
                <td className='statistics' data-test='stats-biggest-expense'>
                  {maxExpenseContent}
                  <p className='black-font'>€ {maxExpense}</p>
                </td>
              </tr>
              <tr>
                <td>Smallest expense:</td>
                <td className='statistics' data-test='stats-smallest-expense'>
                  {minExpenseContent}
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
