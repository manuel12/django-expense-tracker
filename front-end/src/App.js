import "./App.css";

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home/Home";
import Charts from "./pages/Charts/Charts";

function App() {
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  return (
    <Router>
      <div className='App'>
        {" "}
        <nav id='navbar' className='navbar justify-content-center'>
          <a className='navbar-brand navbar-link font-weight-bold' href='/home'>
            Expense Tracker
          </a>

          <ul className='navbar-nav navbar-list flex-row justify-content-around'>
            <li className='nav-item active'>
              <Link className='nav-link' to='/home'>
                Home <span className='sr-only'>(current)</span>
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/charts'>
                Charts & Statistics
              </Link>
            </li>
          </ul>
        </nav>
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
        <div className='container' data-test='container'>
          {/* {% block content %} {% endblock content %} */}
        </div>
      </div>

      <Routes>
        <Route exact path='/home' element={<Home />} />
        <Route path='/charts' element={<Charts />} />
      </Routes>
    </Router>
  );
}

export default App;
