import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../api-service";

import CustomForm from "../../components/CustomForm/CustomForm";

const DeleteBudgetForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [accessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );


  const handleSubmit = async (e) => {
    e.preventDefault();

    API.deleteBudget(navigate, accessToken, id);
  };

  return (
    <CustomForm
      title={"Delete Budget:"}
      formText='Are you sure you want to delete this item?'
      submitBtnText={"Yes"}
      submitBtnColor={"danger"}
      dataTestIdSubmitBtn="delete-budget-yes"
      cancelBtn={true}
      dataTestIdCancelBtn="delete-budget-cancel"
      onSubmit={handleSubmit}
    />
  );
};

export default DeleteBudgetForm;
