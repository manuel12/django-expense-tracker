import "./styles.css";

import React, { useEffect, useState } from "react";

import AddExpenseButton from "../../components/AddExpenseButton/AddExpenseButton";
import AddBudgetButton from "../../components/AddBudgetButton/AddBudgetButton";
import TotalExpensesContainer from "../../components/TotalExpensesContainer/TotalExpensesContainer";
import Instructions from "../../components/Instructions/Instructions";
import BudgetContainer from "../../components/BudgetContainer/BudgetContainer";
import ExpenseTable from "../../components/ExpenseTable/ExpenseTable";
import Pagination from "../../components/Pagination/Pagination";

import LineChart from "../../charts/LineChart/LineChart";

const Home = ({ accessToken }) => {
  const [expenses, setExpenses] = useState([1, 2, 3]);
  const [budget, setBudget] = useState();
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    fetchLineChartData();
  }, []);

  const fetchLineChartData = async () => {
    const res = await fetch("http://localhost:8000/api/line-chart-data/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.ok) {
      const expenseData = await res.json();
      setLineChartData(expenseData);
    }
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

      {expenses.length < 2 ? (
        <h5 className='text-center instruction'>
          When you have 2 or more expenses your line chart will be displayed.
        </h5>
      ) : (
        <LineChart
          chartData={lineChartData}
          title={"Total expenses by day"}
          xLabel={"Dates"}
          yLabel={"(€) Amounts"}
        />
      )}

      <ExpenseTable expenses={expenses}/>

      <Pagination setExpenses={setExpenses}/>
    </>
  );
};

export default Home;
