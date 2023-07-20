import React, { useState } from "react";

import CustomForm from "../../components/CustomForm/CustomForm";

const AddBudgetForm = () => {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );
  const [amount, setAmount] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const res = await fetch("http://localhost:8000/api/budget/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ amount }),
    });

    if (res.status === 201) {
      console.log("Creating budget successful!");
      setAmount(0);
      window.location = "/";
    } else {
      throw new Error("Creating budget failed");
    }
  };

  return (
    <CustomForm title='Create Budget:' cancelBtn={true} onSubmit={handleSubmit}>
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

export default AddBudgetForm;
