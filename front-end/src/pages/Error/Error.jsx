import "./styles.css";

import React from "react";

const Error = ({noAccessMessage}) => {
   
  const textToDisplay = noAccessMessage
    ? "You do not have access to this page, please log in first."
    : "The item you requested is not available. (404)";
  return <h2>{textToDisplay}</h2>;
};

export default Error;
