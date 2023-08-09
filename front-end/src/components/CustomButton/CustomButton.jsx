import "./styles.css";

import React from "react";
import { useNavigate } from "react-router-dom";

const CustomButton = ({
  id,
  text,
  autoFocus,
  className,
  redirectTo,
  dataTestId,
}) => {
  const navigate = useNavigate();

  return (
    <button
      className={`${className} custom-btn btn btn-lg m-3 text-center`}
      onClick={() => {
        navigate(redirectTo);
      }}
    >
      <span
        id={id}
        autoFocus={autoFocus}
        className={`font-weight-bold`}
        data-test={dataTestId}
      >
        {text}
      </span>
    </button>
  );
};

export default CustomButton;
