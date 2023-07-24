import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import CustomForm from "../../components/CustomForm/CustomForm";

const DeleteBudgetForm = (props) => {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:8000/api/budget/delete/${id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (res.status === 204) {
      console.log("Deleting budget successful!");
      window.location = "/";
    } else {
      throw new Error("Deleting budget failed");
    }
  };

  return (
    <CustomForm
      title={"Delete Budget:"}
      formText='Are you sure you want to delete this item?'
      submitBtnText={"Yes"}
      submitBtnColor={"danger"}
      cancelBtn={true}
      onSubmit={handleSubmit}
    />
  );
};

export default DeleteBudgetForm;
