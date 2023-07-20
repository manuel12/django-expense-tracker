import "./styles.css";

import React, { useState } from "react";

const UserGreet = ({ isAuthenticated }) => {
  const [username, setUsername] = useState(
    JSON.parse(localStorage.getItem("username"))
  );

  const handleLogout = async () => {
    const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));

    try {
      const res = await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        header: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (res.status === 205) {
        // Logout successful
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } else {
        // Logout failure
        console.error("Logout failed: ", res.status);
      }
    } catch (e) {
      // Handle any network or other errors
      console.error("Logout failed: ", e);
    }
  };

  return (
    <div
      id='user-greet'
      className='user-greet font-weight-bold'
      data-test='user-greet'
    >
      {isAuthenticated ? (
        <p>
          Hi{` ${username}`}! |{" "}
          <span className='logout-text' onClick={handleLogout}>
            Log Out
          </span>
        </p>
      ) : (
        <>
          <p>You are not logged in.</p>
          <a href="{% url 'accounts:signup' %}">Sign Up</a> |
          <a href="{% url 'accounts:login' %}" data-test='logout'>
            Log In
          </a>
        </>
      )}
    </div>
  );
};

export default UserGreet;
