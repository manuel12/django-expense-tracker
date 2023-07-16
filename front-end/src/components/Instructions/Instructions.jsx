import "./styles.css";

import React from "react";

const Instructions = () => {
  return (
    <>
      <h5 className='font-weight-bold text-center instruction'>
        No expenses for this user.
      </h5>
      <h5 className='text-center instruction'>
        Add some expenses to display your expense list.
      </h5>
    </>
  );
};

export default Instructions;
