import React from "react";

const CustomButton = ({ id, text, autoFocus, className, dataTestId }) => {
  return (
    <div className='p-1 text-center'>
      <a
        id={id}
        autoFocus={autoFocus}
        className={`${className} btn btn-lg font-weight-bold`}
        href="{% url 'expenses:create' %}"
        data-test={dataTestId}
      >
        {text}
      </a>
    </div>
  );
};

export default CustomButton;
