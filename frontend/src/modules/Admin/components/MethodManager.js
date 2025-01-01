import React, { useState } from "react";
import MethodForm from "./MethodForm";
import MethodsTable from "./MethodsTable";

const MethodManager = () => {
  const [showForm, setShowForm] = useState(true); // State to toggle between form and table
  const [methods, setMethods] = useState([]); // State to store method data

  const handleMethodAdded = (newMethod) => {
    // Callback to add the new method to the list and show the table
    setMethods((prevMethods) => [...prevMethods, newMethod]);
    setShowForm(false);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
  };

  const handleAddNewMethod = () => {
    // Show the form when "Add New Method" button is clicked
    setShowForm(true);
  };

  return (
    <div>
      {showForm ? (
        <MethodForm onMethodAdded={handleMethodAdded} onFormSubmit={handleFormSubmit} />
      ) : (
        <>
          <MethodsTable methods={methods} />
          <button onClick={handleAddNewMethod}>Add New Method</button>
        </>
      )}
    </div>
  );
};

export default MethodManager;
