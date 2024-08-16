// DashBoard.js
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const DashBoard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="bg-gray-800 text-white w-48 p-4 ">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <ul className="space-y-2 flex flex-col">
          <li>
            <NavLink 
              to="user" 
              className={({ isActive }) => 
                `block px-4 py-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
              }
            >
              Users
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="response-team" 
              className={({ isActive }) => 
                `block px-4 py-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
              }
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
      
      {/* Main content area */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DashBoard;
