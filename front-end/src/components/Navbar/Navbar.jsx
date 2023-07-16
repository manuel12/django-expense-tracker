import "./styles.css";

import React from "react";
// import { BrowserRouter as Link } from "react-router-dom";

const Link = () => <></>;

const Navbar = () => {
  return (
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
  );
};

export default Navbar;
