import React, { useState } from "react";
import CompanyForm from "./CompanyForm";
import CompaniesTable from "./CompaniesTable";

const CompanyManager = () => {
  const [showCompanyForm, setShowCompanyForm] = useState(true);

  const handleCompanyAdded = () => {
    // Switch to show the CompaniesTable after adding a company
    setShowCompanyForm(false);
  };

  return (
    <div>
      {showCompanyForm ? (
        <CompanyForm onCompanyAdded={handleCompanyAdded} />
      ) : (
        <CompaniesTable />
      )}
    </div>
  );
};

export default CompanyManager;
