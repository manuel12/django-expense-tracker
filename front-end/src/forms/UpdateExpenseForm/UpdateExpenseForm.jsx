import React, { useState } from "react";

import CustomForm from "../../components/CustomForm/CustomForm";

const UpdateExpenseForm = () => {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );

  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState(0);
  const [content, setContent] = useState(0);
  const [date, setDate] = useState(0);
  const [source, setSource] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/expenses/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ amount, category, content, date, source }),
    });

    if (res.status === 201) {
      console.log("Creating expense successful!");
      setAmount(0);
      setCategory(0);
      setContent(0);
      setDate(0);
      setSource(0);
      window.location = "/";
    } else {
      throw new Error("Creating expense failed");
    }
  };
  return (
    <CustomForm
      title={"Update Expense:"}
      cancelBtn={true}
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
        ></input>
      </p>
      <p>
        <label>Category:</label>
        <input
          type='text'
          name='category'
          className='form-control'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        ></input>
      </p>
      <p>
        <label>Content:</label>
        <input
          type='text'
          name='content'
          className='form-control'
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
        ></input>
      </p>
    </CustomForm>
  );
};

export default UpdateExpenseForm;
