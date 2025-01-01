import React, { useState } from 'react';
import styles from './Admin.module.css';
import CompanyForm from './components/CompanyForm';
import MethodForm from './components/MethodForm/MethodForm';
import CompaniesTable from './components/CompaniesTable';
import MethodsTable from './components/MethodsTable';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('companies');
  const [showCompaniesTable, setShowCompaniesTable] = useState(false);
  const [showMethodsTable, setShowMethodsTable] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the hamburger menu

  const handleCompanyAdded = () => {
    setShowCompaniesTable(true);
  };

  const handleMethodAdded = () => {
    setShowMethodsTable(true);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setShowCompaniesTable(false);
    setShowMethodsTable(false);
  };

  const handleViewTable = (table) => {
    if (table === 'companies') {
      setActiveTab('companies');
      setShowCompaniesTable(true);
      setShowMethodsTable(false);
    } else if (table === 'methods') {
      setActiveTab('methods');
      setShowCompaniesTable(false);
      setShowMethodsTable(true);
    }
  };

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.pageHeader}>Admin Panel</h1>

      {/* Hamburger Icon for smaller screens */}
      <div className={styles.hamburgerMenu} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div className={styles.hamburgerIcon}></div>
        <div className={styles.hamburgerIcon}></div>
        <div className={styles.hamburgerIcon}></div>
      </div>

      {/* Tabs for Navigation */}
      <div className={`${styles.tabs} ${isMenuOpen ? styles.showMenu : ''}`}>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'companies' && !showCompaniesTable ? styles.activeTab : ''
          }`}
          onClick={() => handleTabSwitch('companies')}
        >
          Manage Companies
        </button>

        <button
          className={`${styles.tabButton} ${
            activeTab === 'companies' && showCompaniesTable ? styles.activeTab : ''
          }`}
          onClick={() => handleViewTable('companies')}
        >
          View Company Table
        </button>

        <button
          className={`${styles.tabButton} ${
            activeTab === 'methods' && !showMethodsTable ? styles.activeTab : ''
          }`}
          onClick={() => handleTabSwitch('methods')}
        >
          Manage Methods
        </button>

        <button
          className={`${styles.tabButton} ${
            activeTab === 'methods' && showMethodsTable ? styles.activeTab : ''
          }`}
          onClick={() => handleViewTable('methods')}
        >
          View Methods Table
        </button>
      </div>

      {/* Conditional rendering based on active tab */}
      <div className={styles.content}>
        {activeTab === 'companies' && !showCompaniesTable && (
          <CompanyForm onCompanyAdded={handleCompanyAdded} />
        )}
        {activeTab === 'methods' && !showMethodsTable && (
          <MethodForm onMethodAdded={handleMethodAdded} />
        )}
      </div>

      {/* Render tables based on button clicks */}
      {activeTab === 'companies' && showCompaniesTable && <CompaniesTable />}
      {activeTab === 'methods' && showMethodsTable && <MethodsTable />}
    </div>
  );
};

export default AdminPage;
