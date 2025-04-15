import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/DashBoard';
import SignIn from './components/signin/SignIn';
import SignUp from './components/signup/signup';
import AddCategory from './components/category/category';

function App() {
  return (
    <Router>
     <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/add-category" element={<AddCategory />} />
      </Routes>

    </Router>
  );
}

export default App;
