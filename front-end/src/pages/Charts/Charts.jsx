import "./styles.css";

import React, { useState } from "react";

import BarChart from "../../charts/BarChart/BarChart";
import PieChart from "../../charts/PieChart/PieChart";

const Charts = () => {
  const [expenses, setExpenses] = useState([1, 2, 3]);

  const expensesByMonth = {
    "April '23": "72.65",
    "May '23": "74.99",
    "June '23": "87.99",
    "July '23": "101.99",
  };

  const expensesByWeek = {
    "3 weeks ago": "21.00",
    "2 weeks ago": "20.00",
    "last week": "16.00",
    "current week": "65.99",
  };

  const totalExpensesPieChart = {
    "Monthly bill": 139.96,
    Groceries: 97.66,
    "Taxi fare": 21.0,
    "Online shopping": 18.0,
    "Bar tabs": 28.0,
    Miscellaneous: 20.0,
    Electronics: 13.0,
  };

  const monthlyExpensesByCategory = {
    "Monthly bill": 34.99,
    Groceries: 18.0,
    "Taxi fare": 7.0,
    "Online shopping": 6.0,
    "Bar tabs": 16.0,
    Miscellaneous: 20.0,
  };

  return (
    <>
      {!expenses ? (
        <>
          <h5 className='font-weight-bold text-center instruction'>
            No expenses for this user.
          </h5>
          <h5 className='text-center instruction'>
            Please add expenses in order for charts and statistics to appear.
          </h5>
        </>
      ) : (
        <>
          <div className='row'>
            <div className='col-md-6 inlineCanvasContainer'>
              <BarChart
                chartData={expensesByMonth}
                title={"Expense amount by month"}
              />
            </div>

            <div className='col-md-6 inlineCanvasContainer'>
              <BarChart
                chartData={expensesByWeek}
                title={"Expense amount by week (Monday - Sunday)"}
                singleColor={false}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col-md-6 inlineCanvasContainer'>
              <PieChart
                chartData={totalExpensesPieChart}
                title={"Total expense amounts by category"}
              />
            </div>
            <div className='col-md-6 inlineCanvasContainer'>
              <PieChart
                chartData={monthlyExpensesByCategory}
                title={"Monthly expense amounts by category"}
              />
            </div>
          </div>
        </>
      )}


      {/* {% endif %}  */}

      {/* {% if expenses %} */}
      {/* <div id="statistics-table" className="statistics-table" data-test="statistics-table">
    <div className="row">
      <div className="col-md-12">
        <table className="w-100 table-striped table-hover table-bg">
          <tbody>
            <tr>
              <td>Current month's total expenses:</td>
              <td className="statistics" data-test="stats-current-month-expenses">
                € {{ statistics.curr_month_expense_sum }} {% if budget %} / € {{ budget }}

                {% if budget > statistics.curr_month_expense_sum %}
                <span className="badge badge-pill badge-success"> under budget </span>
                {% else %}
                <span className="badge badge-pill badge-danger"> over budget </span>
                {% endif %}
                <a
                  href="{% url 'expenses:update_budget' %}"
                  className="font-weight-bold"
                  data-test="update-budget"
                >
                  <span className="badge-pill badge-warning">✎</span>
                </a>
                <a
                  href="{% url 'expenses:delete_budget' %}"
                  className="font-weight-bold"
                  data-test="delete-budget"
                >
                  <span className="badge-pill badge-danger">X</span>
                </a>
                {% endif %}
              </td>
            </tr>
            <tr>
              <td>Last month's total expenses:</td>
              <td className="statistics" data-test="stats-last-month-expenses">
                € {{ statistics.one_month_ago_expense_sum }}
              </td>
            </tr>
            <tr>
              <td>Current Month vs Last Month's (%) comparison:</td>
              <td
                className="statistics"
                data-test="stats-current-month-vs-last-month-comparison"
              >
                {% if statistics.monthly_percentage_diff == 0 %}
                <span> 0% </span>
                {% elif statistics.monthly_percentage_diff > 100 %}
                <span className="badge badge-pill badge-danger">
                  {{ statistics.monthly_percentage_diff }}%
                </span>
                {% else%}
                <span className="badge badge-pill badge-success">
                  {{ statistics.monthly_percentage_diff }}%
                </span>
                {% endif %}
              </td>
            </tr>
            <tr>
              <td>Monthly expense average:</td>
              <td className="statistics" data-test="stats-monthly-expense-average">
                € {{ statistics.monthly_expense_average }}
              </td>
            </tr>

            <tr>
              <td>Daily expense average:</td>
              <td className="statistics" data-test="stats-daily-expense-average">
                € {{ statistics.daily_expense_average }}
              </td>
            </tr>
            <tr>
              <td>Biggest category expenditure:</td>
              <td className="statistics" data-test="stats-biggest-category-expense">
                {{ statistics.biggest_category_expenditure.category }}:
                <p className="black-font">
                  € {{ statistics.biggest_category_expenditure.amount }}
                </p>
              </td>
            </tr>
            <tr>
              <td>Smallest category expenditure:</td>
              <td className="statistics" data-test="stats-smallest-category-expense">
                {{ statistics.smallest_category_expenditure.category }}:
                <p className="black-font">
                  € {{ statistics.smallest_category_expenditure.amount }}
                </p>
              </td>
            </tr>
            <tr>
              <td>Biggest expense:</td>
              <td className="statistics" data-test="stats-biggest-expense">
                ({{ statistics.max_expense_content}})
                <p className="black-font">€ {{ statistics.max_expense }}</p>
              </td>
            </tr>
            <tr>
              <td>Smallest expense:</td>
              <td className="statistics" data-test="stats-smallest-expense">
                ({{ statistics.min_expense_content}})
                <p className="black-font">€ {{ statistics.min_expense }}</p>
              </td>
            </tr>
            <tr className="font-weight-bold">
              <td>Total expenses:</td>
              <td className="statistics" data-test="stats-total-expenses">
                € {{ statistics.sum_expense }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div> */}
    </>
  );
};

export default Charts;
