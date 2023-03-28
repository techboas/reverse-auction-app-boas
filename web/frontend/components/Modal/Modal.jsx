import React from "react";
import "./Modal.css";
import { useEffect, useState } from "react";
import {
  Button,
} from "@shopify/polaris";

export default function Modal(props) {
  const [modal, setModal] = useState(false);

  const handleProductChanged = (product) => {
    props.handleProductSelect(product)
    console.log(product)
    toggleModal()
  }

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <>
      <Button onClick={toggleModal} className="btn-modal" style={{marginBottom: "1rem"}}>
        Select Product
      </Button>

      {modal && (
        <div className="modal">
          <div className="overlay" onClick={toggleModal}></div>
          <div className="modal-content">
          <h2>Select A Product to be auctioned</h2>
            <div className="modal-list">
            {props.products.map((product) => {
                return (
                  <div className="product-entry" key={product.id}>
                    <h2>{product.title}</h2>
                    <Button onClick={(e) => handleProductChanged(product)}>
                      Select
                    </Button>
                  </div>
                );
              })}
            </div>
            
            
            <Button className="close-modal" onClick={toggleModal}>Close</Button>
          </div>
        </div>
      )}
    </>
  );
}
