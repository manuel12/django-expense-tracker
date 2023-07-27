import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "../../api-service";

import CustomForm from "../../components/CustomForm/CustomForm";

const DeleteExpenseForm = () => {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    API.deleteExpense(accessToken, id);
  };

  return (
    <CustomForm
      title={"Delete Expense:"}
      formText='Are you sure you want to delete this item?'
      submitBtnText={"Yes"}
      submitBtnColor={"danger"}
      dataTestIdSubmitBtn='delete-expense-yes'
      cancelBtn={true}
      dataTestIdCancelBtn='delete-expense-no'
      onSubmit={handleSubmit}
    />
  );
};

export default DeleteExpenseForm;
