import "./App.css";

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home/Home";
import Charts from "./pages/Charts/Charts";

import UserGreet from "./components/UserGreet/UserGreet";

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
        <UserGreet />
        {/* {% block content %} {% endblock content %} */}
        <div className='container' data-test='container'>
          <Routes>
            <Route exact path='/home' element={<Home />} />
            <Route path='/charts' element={<Charts />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
