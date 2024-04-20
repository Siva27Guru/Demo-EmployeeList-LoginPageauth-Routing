import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import NotFoundPage from './components/NotFoundPage';
import RegisterPage from './components/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/dashboard" component={DashboardPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route component={NotFoundPage} />
      </Routes>
    </Router>
  );
}

export default App;