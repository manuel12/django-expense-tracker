import "./styles.css";

import React from "react";

const UserGreet = () => {
  return (
    <div
      id='user-greet'
      className='user-greet font-weight-bold'
      data-test='user-greet'
    >
      {/* {% if user.is_authenticated %} */}
      <p>
        Hi
        {/* {{ user.username }} */}! |
        <a href="{% url 'accounts:logout' %}" data-test='logout-link'>
          Log Out
        </a>
      </p>
      {/* {% else %} */}
      <p>You are not logged in.</p>
      <a href="{% url 'accounts:signup' %}">Sign Up</a> |
      <a href="{% url 'accounts:login' %}" data-test='logout'>
        Log In
      </a>
      {/* {% endif %} */}
    </div>
  );
};

export default UserGreet;
