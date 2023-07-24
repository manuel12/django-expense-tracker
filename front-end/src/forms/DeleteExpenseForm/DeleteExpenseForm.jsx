import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import CustomForm from "../../components/CustomForm/CustomForm";

const DeleteExpenseForm = () => {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:8000/api/expenses/delete/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 204) {
      console.log("Deleting expense successful!");
      window.location = "/";
    } else {
      throw new Error("Deleting expense failed");
    }
  };

  return (
    <CustomForm
      title={"Delete Expense:"}
      formText='Are you sure you want to delete this item?'
      submitBtnText={"Yes"}
      submitBtnColor={"danger"}
      cancelBtn={true}
      onSubmit={handleSubmit}
    />
  );
};

export default DeleteExpenseForm;
