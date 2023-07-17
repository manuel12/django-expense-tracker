import "./styles.css";

import React from "react";

const ExpenseTable = () => {
  const expenseTableData = [
    {
      amount: 25.0,
      content: "Gym memebership",
      category: "Monthly bill",
      source: "McFit Gym",
      date: "2023-07-17 00:00:00",
    },
    {
      amount: 9.99,
      content: "Audible bill",
      category: "Monthly bill",
      source: "Audible",
      date: "2023-07-17 00:00:00",
    },
    {
      amount: 18.0,
      content: "avocado, salmon, blueberries",
      category: "Groceries",
      source: "Carrefour",
      date: "2023-07-17 00:00:00",
    },
    {
      amount: 7.0,
      content: "Uber",
      category: "Taxi fare",
      source: "Uber",
      date: "2023-07-17 00:00:00",
    },
    {
      amount: 6.0,
      content: "HDMI Cable",
      category: "Online shopping",
      source: "Amazon",
      date: "2023-07-17 00:00:00",
    },
  ];

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
          {expenseTableData.map((expense) => {
            return (
              <tr>
                <td>{expense.date}</td>
                <td>{expense.source}</td>
                <td>{expense.category}</td>
                <td>{expense.content}</td>
                <td>€ {expense.amount}</td>
                <td className='font-weight-bold'>
                  <a
                    href="{% url 'expenses:update' expense.pk %}"
                    data-test='update-expense-{{ expense.pk }}'
                  >
                    <span className='badge-pill badge-warning'>✎</span>
                  </a>
                </td>
                <td className='font-weight-bold'>
                  <a
                    href="{% url 'expenses:delete' expense.pk %}"
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
