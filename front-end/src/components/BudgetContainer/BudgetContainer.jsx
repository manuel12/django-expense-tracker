import "./styles.css";

import React, { useState, useEffect } from "react";

const BudgetContainer = () => {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );

  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);

  const currentMonthExpenses = 29;
  const amountOverBudget = currentMonthExpenses - budget;
  const expenseVsBudgetPercentageDiff =
    (currentMonthExpenses / budget.amount) * 100;

  useEffect(() => {
    fetchBudgetData();
  }, []);

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

  return (
    <div className='col-md-9 mx-auto'>
      <div
        id='budget-container'
        className='budget-container font-weight-bold'
        data-test='budget-container'
      >
        <div className='progress'>
          <div
            className={`progress-bar ${
              currentMonthExpenses > budget.amount ? "bg-danger" : "bg-success"
            }`}
            role='progressbar'
            style={{ width: `${expenseVsBudgetPercentageDiff}%` }}
            aria-valuenow='50'
            aria-valuemin='0'
            aria-valuemax='100'
            data-test='budget-progress-bar'
          ></div>
        </div>
        <div
          style={{ color: "green", float: "left", width: "50%" }}
          data-test='monthly-budget'
        >
          Monthly budget:
          <div>
            € {budget.amount}
            <a
              href={`/update-budget/${budget.id}`}
              className='font-weight-bold'
              data-test='update-budget'
            >
              <span className='badge-pill badge-warning'>✎</span>
            </a>
            <a
              href={`/delete-budget/${budget.id}`}
              className='font-weight-bold'
              data-test='delete-budget'
            >
              <span className='badge-pill badge-danger'>X</span>
            </a>
          </div>
        </div>

        <div style={{ color: "green" }}>
          Current month expenses:
          <div>
            € {currentMonthExpenses}
            {currentMonthExpenses > budget && (
              <p style={{ color: "red", float: "right" }}>
                (€ {amountOverBudget} over budget)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetContainer;
