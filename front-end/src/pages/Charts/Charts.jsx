import "./styles.css";

import React, { useEffect, useState } from "react";
import { API } from "../../api-service";

import BarChart from "../../charts/BarChart/BarChart";
import PieChart from "../../charts/PieChart/PieChart";
import StatisticsTable from "../../components/StatisticsTable/StatisticsTable";

const Charts = ({ accessToken }) => {
  const [budget, setBudget] = useState({});

  const [expensesByMonth, setExpensesByMonth] = useState([]);
  const [expensesByWeek, setExpensesByWeek] = useState([]);

  const [totalExpensesPieChart, setTotalExpensesPieChart] = useState([]);
  const [monthlyExpensesByCategory, setMonthlyExpensesByCategory] = useState(
    []
  );
  const [statisticsData, setStatisticsData] = useState({});

  const isObjectEmpty = (obj) => {
    return JSON.stringify(obj) === "{}";
  };

  useEffect(() => {
    expensesByMonth.length === 0 &&
      API.fetchExpensesByMonthData(accessToken, setExpensesByMonth);
    expensesByWeek.length === 0 &&
      API.fetchExpensesByWeekData(accessToken, setExpensesByWeek);

    totalExpensesPieChart.length === 0 &&
      API.fetchTotalExpensesData(accessToken, setTotalExpensesPieChart);

    monthlyExpensesByCategory.length === 0 &&
      API.fetchMonthlyExpensesData(accessToken, setMonthlyExpensesByCategory);

    isObjectEmpty(budget) && API.fetchBudget(accessToken, setBudget);
    isObjectEmpty(statisticsData) &&
      API.fetchStatisticsData(accessToken, setStatisticsData);
  }, []);

  return (
    <>
      {isObjectEmpty(statisticsData) ? (
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

      {!isObjectEmpty(statisticsData) && (
        <StatisticsTable budgetData={budget} statisticsData={statisticsData} />
      )}
    </>
  );
};

export default Charts;
