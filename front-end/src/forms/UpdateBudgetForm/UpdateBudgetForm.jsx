import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../api-service";

import CustomForm from "../../components/CustomForm/CustomForm";

const UpdateBudgetForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [accessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );
  const [budget, setBudget] = useState({ amount: 0 });
  const [budgetTooHighError, setBudgetTooHighError] = useState(false);

  useEffect(() => {
    API.fetchBudget(accessToken, setBudget);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (budget.amount > 999999) {
      setBudgetTooHighError(true);
    } else {
      API.updateBudget(
        navigate, 
        accessToken,
        id,
        JSON.stringify({ amount: budget.amount }),
        setBudget
      );

    }
  };

  return (
    <>
      {budgetTooHighError && (
        <p>Ensure that budget amount is not higher than 999,999.</p>
      )}
      <CustomForm
        title='Update Budget:'
        dataTestIdForm='update-budget-form'
        dataTestIdSubmitBtn='update-budget-save'
        cancelBtn={true}
        dataTestIdCancelBtn='update-budget-cancel'
        onSubmit={handleSubmit}
      >
        <p>
          <label>Amount:</label>
          <input
            type='text'
            name='amount'
            className='form-control'
            value={budget.amount}
            onChange={(e) => setBudget({ amount: e.target.value })}
            data-test='budget-input-amount'
          ></input>
        </p>
      </CustomForm>
    </>
  );
};

export default UpdateBudgetForm;
