import "./styles.css";

import React, { useState, useEffect } from "react";

const ExpenseTable = ({expenses}) => {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );


  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await fetch("http://localhost:8000/api/expenses/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.ok) {
      const paginatedExpenses = await res.json();
      console.log(paginatedExpenses);
      // setExpenses(paginatedExpenses.results);
    } else {
      throw new Error("Fetching expenses failed");
    }
  };

  return (
    <div id='expense-table' className='expense-table' data-test='expense-table'>
      <table className='table table-striped table-hover table-bg'>
        <thead>
          <tr>
            <th scope='col'>Date</th>
            <th scope='col'>Source</th>
            <th scope='col'>Category</th>
            <th scope='col'>Content</th>
            <th scope='col'>Amount</th>
            <th scope='col'>Update</th>
            <th scope='col'>Delete</th>
          </tr>
        </thead>

        <tbody data-test='expense-table-body'>
          {expenses.length > 0 &&
            expenses.map((expense, i) => {
              return (
                <tr key={i}>
                  <td>{expense.date}</td>
                  <td>{expense.source}</td>
                  <td>{expense.category}</td>
                  <td>{expense.content}</td>
                  <td>€ {expense.amount}</td>
                  <td className='font-weight-bold'>
                    <a
                      href='/update'
                      data-test='update-expense-{{ expense.pk }}'
                    >
                      <span className='badge-pill badge-warning'>✎</span>
                    </a>
                  </td>
                  <td className='font-weight-bold'>
                    <a
                      href='expenses/delete/'
                      data-test='delete-expense-{{ expense.pk }}'
                    >
                      <span className='badge-pill badge-danger'>X</span>
                    </a>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
