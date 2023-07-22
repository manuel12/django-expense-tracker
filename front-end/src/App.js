import "./App.css";

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Charts from "./pages/Charts/Charts";

import Navbar from "./components/Navbar/Navbar";
import UserGreet from "./components/UserGreet/UserGreet";
import CustomForm from "./components/CustomForm/CustomForm";

import AddExpenseForm from "./forms/AddExpenseForm/AddExpenseForm";
import UpdateExpenseForm from "./forms/UpdateExpenseForm/UpdateExpenseForm";
import DeleteExpenseForm from "./forms/DeleteExpenseForm/DeleteExpenseForm";

import AddBudgetForm from "./forms/AddBudgetForm/AddBudgetForm";
import UpdateBudgetForm from "./forms/UpdateBudgetForm/UpdateBudgetForm";
import DeleteBudgetForm from "./forms/DeleteBudgetForm/DeleteBudgetForm";

function App() {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );

  const createExpenseFormFields = [
    "amount",
    "content",
    "category",
    "date",
    "source",
  ];

  if (!accessToken) {
    return <Login setAccessToken={setAccessToken} />;
  }

  return (
    <Router>
      <div className='App'>
        <Navbar RouterLink={Link} />
        <UserGreet isAuthenticated={accessToken} />
        <div className='container' data-test='container'>
          <Routes>
            <Route
              exact
              path='/'
              element={<Home accessToken={accessToken} />}
            />
            <Route path='/charts' element={<Charts />} />

            <Route path='/create' element={<AddExpenseForm />} />
            <Route path='/update/:id' element={<UpdateExpenseForm />} />
            <Route path='/delete/:id' element={<DeleteExpenseForm />} />

            <Route path='/create-budget' element={<AddBudgetForm />} />
            <Route path='/update-budget/:id' element={<UpdateBudgetForm />} />
            <Route path='/delete-budget/:id' element={<DeleteBudgetForm />} />

            <Route path='/login' element={<Login />} />

            <Route
              path='/signup'
              element={
                <CustomForm
                  title='Sign up:'
                  formFields={["Username", "Password", "Password confirmation"]}
                  submitBtnText={"Sign up"}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
