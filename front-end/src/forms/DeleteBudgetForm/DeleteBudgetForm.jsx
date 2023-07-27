import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "../../api-service";

import CustomForm from "../../components/CustomForm/CustomForm";

const DeleteBudgetForm = () => {

  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    API.deleteBudget(accessToken, id);
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
