import "./styles.css";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../api-service";

const UserGreet = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(
    JSON.parse(localStorage.getItem("username"))
  );
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    setUsername(JSON.parse(localStorage.getItem("username")));
    setUserLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = async () => {
      API.logout({ navigate, setUserLoggedIn });
  };

  return (
    <div
      id='user-greet'
      className='user-greet font-weight-bold'
      data-test='user-greet'
    >
      {userLoggedIn && username ? (
        <p>
          Hi{` ${username}`}! |{" "}
          <span
            className='logout-text'
            onClick={handleLogout}
            data-test='logout-link'
          >
            Log Out
          </span>
        </p>
      ) : (
        <>
          <p>You are not logged in.</p>
          <a onClick={() => navigate("/accounts/signup")}>Sign Up</a> |
          <a onClick={() => navigate("/accounts/login")}>Log In</a>
        </>
      )}
    </div>
  );
};

export default UserGreet;
