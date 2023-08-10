import "./styles.css";

import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav id='navbar' className='navbar justify-content-center'>
      <a
        className='navbar-brand font-weight-bold'
        href='/'
      >
        Expense Tracker
      </a>

      <ul className='navbar-nav navbar-list flex-row justify-content-around'>
        <li className='nav-item active'>
          <div
            className='nav-link'
            onClick={() => {
              navigate("/");
            }}
          >
            Home <span className='sr-only'>(current)</span>
          </div>
        </li>
        <li className='nav-item'>
          <div
            className='nav-link'
            onClick={() => {
              navigate("charts/");
            }}
          >
            Charts & Statistics
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
