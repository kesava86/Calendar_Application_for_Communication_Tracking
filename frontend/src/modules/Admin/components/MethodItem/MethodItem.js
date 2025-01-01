import React from "react";
import styles from "./MethodItem.module.css"; // Import styles for MethodItem

const MethodItem = ({ method, index, onRemove, onToggleMandatory, onMoveUp, onMoveDown }) => {
  return (
    <div className={styles.methodItem}>
      <div className={styles.methodDetails}>
        <h3>{method.name}</h3>
        <p>{method.description}</p>
        <p>Sequence: {method.sequence}</p>
        <p>Mandatory: {method.mandatory ? "Yes" : "No"}</p>
      </div>
      <div className={styles.actions}>
        <button onClick={() => onMoveUp(index)} disabled={index === 0}>Move Up</button>
        <button onClick={() => onMoveDown(index)} disabled={index === method.length - 1}>Move Down</button>
        <button onClick={() => onToggleMandatory(index)}>Toggle Mandatory</button>
        <button onClick={() => onRemove(index)}>Remove</button>
      </div>
    </div>
  );
};

export default MethodItem;
