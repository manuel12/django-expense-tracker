import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import CustomForm from "../../components/CustomForm/CustomForm";

const UpdateBudgetForm = () => {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );
  const { id } = useParams();
  const [amount, setAmount] = useState(0);

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
      setAmount(budgetData.amount);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:8000/api/budget/update/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ amount }),
    });

    if (res.status === 200) {
      console.log("Updating budget successful!");
      setAmount(0);
      window.location = "/";
    } else {
      throw new Error("Updating budget failed");
    }
  };

  return (
    <CustomForm title='Update Budget:' cancelBtn={true} onSubmit={handleSubmit}>
      <p>
        <label>Amount:</label>
        <input
          type='text'
          name='amount'
          className='form-control'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        ></input>
      </p>
    </CustomForm>
  );
};

export default UpdateBudgetForm;
