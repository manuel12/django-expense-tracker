import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../api-service";

import CustomForm from "../../components/CustomForm/CustomForm";

const DeleteExpenseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [accessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    API.deleteExpense(navigate, accessToken, id);
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
