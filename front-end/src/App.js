import "./App.css";

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home/Home";
import Charts from "./pages/Charts/Charts";

import Navbar from "./components/Navbar/Navbar";
import UserGreet from "./components/UserGreet/UserGreet";

function App() {
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  return (
    <Router>
      <div className='App'>
        {" "}
        <Navbar RouterLink={Link} />
        <UserGreet />
        {/* {% block content %} {% endblock content %} */}
        <div className='container' data-test='container'>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/charts' element={<Charts />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
