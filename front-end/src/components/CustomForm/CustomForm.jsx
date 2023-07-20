import "./styles.css";

import React from "react";

const CustomForm = ({
  title,
  formFields = [],
  formText = "",
  dataTestIdForm = "",
  submitBtnText = "Save",
  submitBtnColor = "primary",
  dataTestIdSubmitBtn = "",
  cancelBtn = false,
  dataTestIdCancelBtn = "",
  onSubmit,
  children
}) => {
  return (
    <div className='form-group'>
      <h3>{title}</h3>
      <form
        className='font-weight-bold'
        method='post'
        data-test={dataTestIdForm}
        onSubmit={onSubmit}
      >
        {/* {% csrf_token %} {{ form.as_p }} */}
        {formFields.map((field) => (
          <p>
            <label>{field}:</label>
            <input type='text' name={field} className='form-control'></input>
          </p>
        ))}
        {formText && <p>{formText}</p>}
        {children}
        <button
          type='submit'
          className={`btn btn-${submitBtnColor}`}
          data-test={dataTestIdSubmitBtn}
        >
          {submitBtnText}
        </button>
        {cancelBtn && (
          <a
            className='btn btn-secondary cancel-btn'
            href="{% url 'expenses:home' %}"
            data-test={dataTestIdCancelBtn}
          >
            Cancel
          </a>
        )}
      </form>
    </div>
  );
};

export default CustomForm;
