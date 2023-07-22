import React from "react";

import "./styles.css";

const CustomButton = ({
  id,
  text,
  autoFocus,
  className,
  redirectTo,
  dataTestId,
}) => {
  return (
    <button className={`${className} custom-btn btn btn-lg m-3 text-center`}>
      <a
        id={id}
        autoFocus={autoFocus}
        className={`font-weight-bold`}
        href={redirectTo}
        data-test={dataTestId}
      >
        {text}
      </a>
    </button>
  );
};

export default CustomButton;
