import React from 'react';
import './css/ProductCard.css';

const ProductPreview = ({ product }) => {
    console.log(product)
  return (
    <div className="product-card">
      {product.image.src? <img style={{ width: 100, height: 100 }} src={product.image.src}/>: null }
     
      {/* <div className="product-id">ID: {product.id}</div> */}
      <div className="product-name">{product.title}</div>
      <div className="product-price">€ {product.variants[0].price}</div>
      <div className="product-variant">{product.variants[0].title}</div>

    </div>
  );
};

export default ProductPreview;