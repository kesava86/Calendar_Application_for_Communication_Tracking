import React from "react";
import { Link, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import AdminPage from "./modules/Admin/AdminPage";
import UserPage from "./modules/User/UserPage";

const App = () => {
  const location = useLocation(); // Get the current location

  // Check if the current route is "/admin" or "/user"
  const isUserPage = location.pathname === "/user";
  const isAdminPage = location.pathname === "/admin";

  return (
    <>
      {/* Display the layout only if not on /user or /admin */}
      {!isUserPage && !isAdminPage && (
        <div className={styles.container}>
          <div className={styles.boxContainer}>
            <Link to="/admin" className={styles.box}>
              <img
                src="/admin-icon.png" // Path to admin logo in public folder
                alt="Admin Logo"
                className={styles.logo}
              />
              <h2 className={styles.label}>Admin</h2>
            </Link>
            <Link to="/user" className={styles.box}>
              <img
                src="/user-icon.png" // Path to user logo in public folder
                alt="User Logo"
                className={styles.logo}
              />
              <h2 className={styles.label}>User</h2>
            </Link>
          </div>
        </div>
      )}

      {/* Define the routes */}
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} />
        {/* Add additional routes if needed */}
      </Routes>
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
