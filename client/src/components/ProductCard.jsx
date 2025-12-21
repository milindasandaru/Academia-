import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-md w-48 flex-shrink-0 border border-gray-100">
      <div className="h-32 bg-gray-200 rounded-md mb-2 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-bold text-sm text-gray-800 truncate">{product.name}</h3>
      <div className="flex justify-between items-center mt-1">
        <span className="text-blue-600 font-semibold text-sm">${product.price}</span>
        <span className="text-xs text-gray-400 bg-gray-100 px-1 rounded">{product.category}</span>
      </div>
    </div>
  );
};

export default ProductCard;