import React, { useEffect, useState } from "react";

import CustomForm from "../../components/CustomForm/CustomForm";

const Login = ({ setAccessToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const { access, refresh } = data;
        localStorage.setItem('accessToken', JSON.stringify(access))
        setAccessToken(access);
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CustomForm title='Login:' submitBtnText={"Log In"} onSubmit={handleSubmit}>
      <p>
        <label>Username:</label>
        <input
          type='text'
          name='username'
          className='form-control'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        ></input>
      </p>
    </CustomForm>
  );
};

export default Login;
