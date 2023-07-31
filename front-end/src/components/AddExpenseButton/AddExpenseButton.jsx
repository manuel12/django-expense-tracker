import "./styles.css";

import React, { useEffect } from "react";
import CustomButton from "../CustomButton/CustomButton";

const AddExpenseButton = () => {
  return (
    <CustomButton
      id='create-expense-btn'
      autoFocus={true}
      text='+Add Expense'
      className='create-expense-btn'
      redirectTo='create/'
      dataTestId='create-expense'
    />
  );
};

export default AddExpenseButton;
