import "./styles.css";

import React from "react";

const TotalExpensesContainer = ({totalExpenseAmount}) => {

  return (
    <div
      id='total-expenses-container'
      className='total-expenses-container m-auto'
    >
      Total expenses: <span>€{totalExpenseAmount}</span>
    </div>
  );
};

export default TotalExpensesContainer;
