import "./styles.css";

import React from "react";
import { useNavigate } from "react-router-dom";

const CustomForm = ({
  title,
  formFields = [],
  formText = "",
  dataTestIdForm = "",
  submitBtnText = "Save",
  submitBtnColor = "primary",
  dataTestIdSubmitBtn = "",
  cancelBtn = false,
  cancelBtnRedirect = "/",
  dataTestIdCancelBtn = "",
  onSubmit,
  children,
}) => {
  const navigate = useNavigate();
  return (
    <div className='form-container form-group'>
      <h3>{title}</h3>
      <form
        className='font-weight-bold'
        method='post'
        data-test={dataTestIdForm}
        onSubmit={onSubmit}
      >
        {formFields.map((field) => (
          <p>
            <label>{field}:</label>
            <input type='text' name={field} className='form-control'></input>
          </p>
        ))}
        {formText && <p>{formText}</p>}
        {children}
        <div className='form-buttons-container'>
          <button
            type='submit'
            className={`btn btn-${submitBtnColor}`}
            data-test={dataTestIdSubmitBtn}
          >
            {submitBtnText}
          </button>
          {cancelBtn && (
            <button
              type='button'
              className='btn btn-secondary cancel-btn'
              onClick={() => navigate(cancelBtnRedirect)}
              data-test={dataTestIdCancelBtn}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CustomForm;
