import React, { useState } from 'react';
import './css/ProductCard.css';

function ConfirmationDialog({ message, onConfirm, deleteAuction, handleDisplayConfirmationDialog }) {

  const handleConfirmClick = () => {
    deleteAuction();
  };

  const handleCancelClick = () => {
    handleDisplayConfirmationDialog()
  };

  return (
    <div>
      <div className="ConfirmationDialog">
          <p className="ConfirmationDialog-message">{message}</p>
          <div className="ConfirmationDialog-buttons">
          <h1>Delete Item: XXXX From Auction list?</h1>
            <button onClick={handleConfirmClick} className="ConfirmationDialog-confirmButton">Yes</button>
            <button onClick={handleCancelClick} className="ConfirmationDialog-cancelButton">No</button>
          </div>
        </div>
    </div>
  );
}

export default ConfirmationDialog;