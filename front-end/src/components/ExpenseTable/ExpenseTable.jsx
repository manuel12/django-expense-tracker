import "./styles.css";

import React from "react";


const formatDateToYYYYMMDD = (dateString) => {
  const inputDate = new Date(dateString);

  // Get the components of the date (year, month, day)
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so add 1
  const day = String(inputDate.getDate()).padStart(2, "0");

  // Create the formatted date string
  const formattedDateString = `${year}-${month}-${day}`;
  return formattedDateString;
};

const ExpenseTable = ({ expenses = [] }) => {
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
                  <td>{formatDateToYYYYMMDD(expense.date)}</td>
                  <td>{expense.source}</td>
                  <td>{expense.category}</td>
                  <td>{expense.content}</td>
                  <td>€ {expense.amount}</td>
                  <td className='font-weight-bold'>
                    <a
                      href={`/update-expense/${expense.id}/`}
                      data-test='update-expense-{{ expense.pk }}'
                    >
                      <span className='badge-pill badge-warning'>✎</span>
                    </a>
                  </td>
                  <td className='font-weight-bold'>
                    <a
                      href={`/delete-expense/${expense.id}/`}
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
