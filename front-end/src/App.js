import "./App.css";

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

import Home from "./pages/Home/Home";
import Charts from "./pages/Charts/Charts";
import Error from "./pages/Error/Error";

import Navbar from "./components/Navbar/Navbar";
import UserGreet from "./components/UserGreet/UserGreet";

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

  useEffect(() => {
    console.log(accessToken);
  }, [accessToken]);

  return (
    <Router>
      <div className='App'>
        <Navbar />
        <UserGreet
          isAuthenticated={accessToken}
          setAccessToken={setAccessToken}
        />
        <div className='container' data-test='container'>
          {!accessToken ? (
            <Routes>
              <Route
                path='/accounts/login/'
                element={<Login setAccessToken={setAccessToken} />}
              />
              <Route path='/accounts/signup/' element={<Signup />} />
              <Route path='/' element={<Error noAccessMessage={true} />} />
              <Route
                path='/charts/'
                element={<Error noAccessMessage={true} />}
              />
              <Route path='*' element={<Error />} />
            </Routes>
          ) : (
            <Routes>
              <Route path='*' element={<Error />} />
              <Route
                exact
                path='/'
                element={<Home accessToken={accessToken} />}
              />
              <Route
                path='/charts/'
                element={<Charts accessToken={accessToken} />}
              />

              <Route path='/create-expense/' element={<AddExpenseForm />} />
              <Route
                path='/update-expense/:id/'
                element={<UpdateExpenseForm />}
              />
              <Route
                path='/delete-expense/:id/'
                element={<DeleteExpenseForm />}
              />

              <Route path='/create-budget/' element={<AddBudgetForm />} />
              <Route
                path='/update-budget/:id/'
                element={<UpdateBudgetForm />}
              />
              <Route
                path='/delete-budget/:id/'
                element={<DeleteBudgetForm />}
              />

              <Route
                path='/accounts/login/'
                element={<Login setAccessToken={setAccessToken} />}
              />

              <Route path='/accounts/signup/' element={<Signup />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
