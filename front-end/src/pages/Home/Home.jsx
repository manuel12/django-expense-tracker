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
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    fetchLineChartData();
    fetchExpenses();
    fetchBudgetData();
  }, []);

  const fetchExpenses = async () => {
    const res = await fetch(
      // `http://localhost:8000/api/expenses/?page=${paginationSuffix}`,
      `http://localhost:8000/api/expenses/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (res.ok) {
      const expensesData = await res.json();
      setExpenses(expensesData);
    } else {
      throw new Error("Fetching expenses failed");
    }
  };

  const fetchBudgetData = async () => {
    const res = await fetch("http://localhost:8000/api/budget/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.ok) {
      const budgetData = await res.json();
      console.log(budgetData);
      setBudget(budgetData);
    }
  };

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
        {!budget.amount && <AddBudgetButton />}
      </div>

      <TotalExpensesContainer />

      {!expenses && <Instructions />}

      {budget.amount && <BudgetContainer />}

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

      <ExpenseTable expenses={expenses} />

      {/* <Pagination setExpenses={setExpenses}/> */}
    </>
  );
};

export default Home;
