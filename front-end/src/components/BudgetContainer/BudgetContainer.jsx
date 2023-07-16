import "./styles.css";

import React, { useState } from "react";

const BudgetContainer = () => {
  const [expenses, setExpenses] = useState();
  const [budget, setBudget] = useState(0);

  const currentMonthExpenses = 50;
  const amountOverBudget = currentMonthExpenses - budget;
  const expenseVsBudgetPercentageDiff = (currentMonthExpenses / budget) * 100;

  return (
    <div className='col-md-9 mx-auto'>
      <div
        id='budget-container'
        className='budget-container font-weight-bold'
        data-test='budget-container'
      >
        <div className='progress'>
          <div
            className='progress-bar {% if currentMonthExpenses > budget %} bg-danger {% else %} bg-success {% endif %}'
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
            € {budget}
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
