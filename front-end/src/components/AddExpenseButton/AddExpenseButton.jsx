import "./styles.css";

import React from "react";
import CustomButton from "../CustomButton/CustomButton";

const AddExpenseButton = () => {
  return (
    <CustomButton
      id='create-expense-btn'
      autoFocus={true}
      text='+Add Expense'
      className='create-expense-btn'
      dataTestId='create-expense'
    />
  );
};

export default AddExpenseButton;
