import React from 'react';
import './css/ProductCard.css';

const ProductPreview = ({ product }) => {
    console.log(product)
  return (
    <div className="product-card">
      <div className="product-id">ID: {product.id}</div>
      <div className="product-name">{product.title}</div>
      <div className="product-price">$33</div>
    </div>
  );
};

export default ProductPreview;