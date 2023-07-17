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
        <LineChart />
      )}

      <ExpenseTable />

      <Pagination />
    </>
  );
};

export default Home;
