import React, { useState } from 'react';
import './css/ProductCard.css';

function ConfirmationDialog({ message, onConfirm, onCancel }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmClick = () => {
    onConfirm();
    setShowConfirmation(false);
  };

  const handleCancelClick = () => {
    onCancel();
    setShowConfirmation(false);
  };

  const handleOpenDialog = () => {
    setShowConfirmation(true);
  };

  return (
    <div>
      
      {showConfirmation && (
        <div className="ConfirmationDialog">
          <p className="ConfirmationDialog-message">{message}</p>
          <div className="ConfirmationDialog-buttons">
          <button onClick={handleOpenDialog}>Delete</button>
            <button onClick={handleConfirmClick} className="ConfirmationDialog-confirmButton">Yes</button>
            <button onClick={handleCancelClick} className="ConfirmationDialog-cancelButton">No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfirmationDialog;