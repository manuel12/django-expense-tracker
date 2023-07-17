import "./styles.css";

import React from "react";

const Navbar = ({ RouterLink }) => {
  return (
    <nav id='navbar' className='navbar justify-content-center'>
      <a
        className='navbar-brand navbar-routerLink font-weight-bold'
        href='/home'
      >
        Expense Tracker
      </a>

      <ul className='navbar-nav navbar-list flex-row justify-content-around'>
        <li className='nav-item active'>
          <RouterLink className='nav-link' to='/'>
            Home <span className='sr-only'>(current)</span>
          </RouterLink>
        </li>
        <li className='nav-item'>
          <RouterLink className='nav-link' to='/charts'>
            Charts & Statistics
          </RouterLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
