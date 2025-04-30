import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import Login from './routes/Login';
import Dashboard from './routes/Dashboard';
import User from './routes/User';
import Transactions from './routes/Transactions';
import PrivateRoute from './Hooks/PrivateRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      
      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/users" element={<PrivateRoute />}>
        <Route path="/users" element={<User />} />
      </Route>
      <Route path="/transactions" element={<PrivateRoute />}>
        <Route path="/transactions" element={<Transactions />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);
