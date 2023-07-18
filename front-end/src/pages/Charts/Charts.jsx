import "./styles.css";

import React, { useState } from "react";

import BarChart from "../../charts/BarChart/BarChart";
import PieChart from "../../charts/PieChart/PieChart";
import StatisticsTable from "../../components/StatisticsTable/StatisticsTable";

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

      {expenses && <StatisticsTable />}
    </>
  );
};

export default Charts;
