import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../api-service";

import CustomForm from "../../components/CustomForm/CustomForm";

const AddExpenseForm = () => {
  const navigate = useNavigate();
  const [accessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );

  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [source, setSource] = useState("");

  const [amountZeroError, setAmountZeroError] = useState(false);
  const [amountTooHighError, setAmountTooHighError] = useState(false);
  const [dateNotValid, setDateNotValid] = useState(false);

  const isValidDateFormat = (dateString) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(dateString);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (amount == 0) {
      setAmountZeroError(true);
    } else if (amount > 9999999999) {
      setAmountTooHighError(true);
    } else if (!isValidDateFormat(date)) {
      setDateNotValid(true);
    } else {
      API.createExpense(
        navigate,
        accessToken,
        JSON.stringify({ amount, category, content, date, source }),
        setAmount,
        setCategory,
        setContent,
        setDate,
        setSource
      );
    }
  };
  return (
    <>
      {amountZeroError && (
        <p>Ensure this value is greater than or equal to 0.01.</p>
      )}
      {amountTooHighError && (
        <p>Ensure that expense amount is not bigger than 9,999,999,999.</p>
      )}
      {dateNotValid && <p>Enter a valid date/time.</p>}
      <CustomForm
        title={"Create Expense:"}
        dataTestIdForm='create-expense-form'
        cancelBtn={true}
        dataTestIdSubmitBtn='create-expense-save'
        onSubmit={handleSubmit}
      >
        <p>
          <label>Amount:</label>
          <input
            type='text'
            name='amount'
            className='form-control'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            data-test='expense-input-amount'
          ></input>
        </p>
        <p>
          <label>Category:</label>
          <select
            name='category'
            className='form-control'
            onChange={(e) => setCategory(e.target.value)}
            data-test='expense-input-category'
            defaultValue=''
          >
            <option value=''>
              ---------
            </option>
            <option value='Bar tabs'>Bar tabs</option>
            <option value='Monthly bill'>Monthly bill</option>
            <option value='Online shopping'>Online shopping</option>
            <option value='Electronics'>Electronics</option>
            <option value='Groceries'>Groceries</option>
            <option value='Taxi fare'>Taxi fare</option>
            <option value='Miscellaneous'>Miscellaneous</option>
          </select>
        </p>
        <p>
          <label>Content:</label>
          <input
            type='text'
            name='content'
            className='form-control'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            data-test='expense-input-content'
          ></input>
        </p>
        <p>
          <label>Source:</label>
          <input
            type='text'
            name='source'
            className='form-control'
            value={source}
            onChange={(e) => setSource(e.target.value)}
            data-test='expense-input-source'
          ></input>
        </p>
        <p>
          <label>Date:</label>
          <input
            type='text'
            name='date'
            className='form-control'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            data-test='expense-input-date'
          ></input>
        </p>
      </CustomForm>
    </>
  );
};

export default AddExpenseForm;
