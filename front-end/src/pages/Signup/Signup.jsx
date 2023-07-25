import "./styles.css";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../api-service";

import CustomForm from "../../components/CustomForm/CustomForm";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [noCredentialsError, setNoCredendtialsError] = useState(false);
  const [passwordsNoMatchError, setPasswordsNoMatchError] = useState(false);
  const [usernameTakenError, setUsernameTakenError] = useState(false);

  const [userRegisteredSuccessfully, setUserRegisteredSuccessfully] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "" && password === "" && passwordConfirmation === "") {
      setNoCredendtialsError(true);
      setUsernameTakenError(false);
    } else if (username !== "" && password !== passwordConfirmation) {
      setPasswordsNoMatchError(true);
    } else {
      API.signup({
        navigate,
        username,
        setUsername,
        password,
        setPassword,
        setPasswordConfirmation,
        setUsernameTakenError,
        setUserRegisteredSuccessfully,
      });
    }
  };

  return (
    <>
      {noCredentialsError && (
        <p>You need to provide username, password and password confirmation.</p>
      )}

      {userRegisteredSuccessfully && (
        <p className='success-message' data-test='success-message'>
          User registered successfully!
        </p>
      )}

      <CustomForm
        title='Sign Up:'
        submitBtnText={"Sign Up"}
        onSubmit={handleSubmit}
        dataTestIdSubmitBtn='signup'
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
          <label>
            Required. 150 characters or fewer. Letters, digits and @/./+/-/_
            only.
          </label>
          {usernameTakenError && (
            <label className='error-label' data-test='user-taken-error-label'>
              The username you entered has already been taken! Please try
              another username.
            </label>
          )}
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
          <label>Enter the same password as before, for verification.</label>
        </p>
        <br />

        <ul className='password-requirements'>
          <li>
            Your password can’t be too similar to your other personal
            information.
          </li>
          <li>Your password must contain at least 8 characters.</li>
          <li>Your password can’t be a commonly used password.</li>
          <li>Your password can’t be entirely numeric.</li>
          {passwordsNoMatchError && (
            <li
              className='error-label'
              data-test='passwords-no-match-error-label'
            >
              The two password fields didn’t match!
            </li>
          )}
        </ul>

        <p>
          <label>Password confirmation:</label>
          <input
            type='password'
            name='password-confirmation'
            className='form-control'
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            data-test='password-confirmation'
          ></input>
          <label>Enter the same password as before, for verification.</label>
        </p>
      </CustomForm>
    </>
  );
};

export default Signup;
