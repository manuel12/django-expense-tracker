import "./styles.css";

import React, { useState } from "react";

const TotalExpensesContainer = () => {
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(100);

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
