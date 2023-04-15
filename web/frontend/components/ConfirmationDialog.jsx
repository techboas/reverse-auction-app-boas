import React, { useState } from 'react';
import './css/ProductCard.css';

function ConfirmationDialog({ message,title, auctionItem, onConfirm, deleteAuction, handleDisplayConfirmationDialog }) {

  const handleConfirmClick = () => {
    console.log(auctionItem)
    console.log('reached here',auctionItem.id)
    deleteAuction(auctionItem.id);
  };

  const handleCancelClick = () => {
    handleDisplayConfirmationDialog()
  };

  return (
    <div>
      <div className="ConfirmationDialog">
          <p className="ConfirmationDialog-message">{message}</p>
          <h1 className="ConfirmationDialog-title">Delete Item: {auctionItem.title} From Auction list?</h1>

          <div className="ConfirmationDialog-buttons">
            <button onClick={handleConfirmClick} className="ConfirmationDialog-confirmButton">Yes</button>
            <button onClick={handleCancelClick} className="ConfirmationDialog-cancelButton">No</button>
          </div>
        </div>
    </div>
  );
}

export default ConfirmationDialog;