import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../api-service";

import CustomForm from "../../components/CustomForm/CustomForm";

const UpdateExpenseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [accessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );

  const [expenses, setExpenses] = useState([]);

  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState(0);
  const [content, setContent] = useState(0);
  const [date, setDate] = useState(0);
  const [source, setSource] = useState(0);

  const [amountZeroError, setAmountZeroError] = useState(false);
  const [amountTooHighError, setAmountTooHighError] = useState(false);
  const [dateNotValid, setDateNotValid] = useState(false);

  useEffect(() => {
    API.fetchExpenses(accessToken, setExpenses);
  }, []);

  useEffect(() => {
    const expenseToUpdate = expenses.find((expense) => expense.id == id);

    if (expenseToUpdate) {
      setAmount(expenseToUpdate.amount);
      setCategory(expenseToUpdate.category);
      setContent(expenseToUpdate.content);
      setDate(removeTimeFromDateTimeStr(expenseToUpdate.date));
      setSource(expenseToUpdate.source);
    }
  }, [expenses]);

  const removeTimeFromDateTimeStr = (str) => {
    return str.split("T")[0];
  };
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
      API.updateExpense(
        navigate, 
        accessToken,
        id,
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
        title={"Update Expense:"}
        dataTestIdForm='update-expense-form'
        cancelBtn={true}
        dataTestIdSubmitBtn='update-expense-save'
        dataTestIdCancelBtn='update-expense-cancel'
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
            value={category}
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

export default UpdateExpenseForm;
