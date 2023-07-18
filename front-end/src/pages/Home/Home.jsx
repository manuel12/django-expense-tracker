import "./styles.css";

import React, { useState } from "react";

import AddExpenseButton from "../../components/AddExpenseButton/AddExpenseButton";
import AddBudgetButton from "../../components/AddBudgetButton/AddBudgetButton";
import TotalExpensesContainer from "../../components/TotalExpensesContainer/TotalExpensesContainer";
import Instructions from "../../components/Instructions/Instructions";
import BudgetContainer from "../../components/BudgetContainer/BudgetContainer";
import ExpenseTable from "../../components/ExpenseTable/ExpenseTable";
import Pagination from "../../components/Pagination/Pagination";

import LineChart from "../../charts/LineChart/LineChart";

const Home = () => {
  const [expenses, setExpenses] = useState([1, 2, 3]);
  const [budget, setBudget] = useState();

  const expensesByDay = {
    "17' Jun": 25.0,
    "19' Jun": 9.99,
    "20' Jun": 6.0,
    "21' Jun": 8.0,
    "22' Jun": 6.0,
    "23' Jun": 12.0,
    "26' Jun": 13.0,
    "28' Jun": 8.0,
    "03' Jul": 20.0,
    "10' Jul": 16.0,
    "17' Jul": 65.99000000000001,
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
          chartData={expensesByDay}
          title={"Total expenses by day"}
          xLabel={"Dates"}
          yLabel={"(€) Amounts"}
        />
      )}

      <ExpenseTable />

      <Pagination />
    </>
  );
};

export default Home;
