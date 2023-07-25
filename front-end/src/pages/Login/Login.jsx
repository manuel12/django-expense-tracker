import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../api-service";

import CustomForm from "../../components/CustomForm/CustomForm";

const Login = ({ setAccessToken }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [noCredentialsError, setNoCredendtialsError] = useState(false);
  const [invalidCredentialsError, setInvalidCredentialsError] = useState(false);

  useEffect(() => {
    if (username !== "" || password !== "") setNoCredendtialsError(false);
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "" && password === "") {
      setNoCredendtialsError(true);
      setInvalidCredentialsError(false);
    } else {
      API.login({
        navigate,
        username,
        password,
        setAccessToken,
        setInvalidCredentialsError,
      });
    }
  };

  return (
    <>
      {noCredentialsError && (
        <p>You need to provide username and password credentials.</p>
      )}
      {invalidCredentialsError && (
        <p>
          Your username and password didn't match our records. Please try again.
        </p>
      )}
      <CustomForm
        title='Login:'
        submitBtnText={"Log In"}
        onSubmit={handleSubmit}
        dataTestIdSubmitBtn='login'
      >
        <p>
          <label>Username:</label>
          <input
            type='text'
            name='username'
            className='form-control'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            data-test='username'
          ></input>
        </p>

        <p>
          <label>Password:</label>
          <input
            type='password'
            name='password'
            className='form-control'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-test='password'
          ></input>
        </p>
      </CustomForm>
    </>
  );
};

export default Login;
