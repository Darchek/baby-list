'use client';

import { Product } from '@/lib/database';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onReserve?: (product: Product) => Promise<void>;
}

export default function ProductCard({ product, onReserve }: ProductCardProps) {
  const [isReserving, setIsReserving] = useState(false);
  const isReserved = !!product.reserved_by;

  const handleReserve = async () => {
    if (isReserved || !onReserve) return;
    
    setIsReserving(true);
    try {
      await onReserve(product);
    } catch (error) {
      console.error('Failed to reserve product:', error);
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div className={`rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border-2 ${
      isReserved 
        ? 'bg-gray-100 border-gray-300' 
        : 'bg-white border-gray-200 hover:border-blue-300'
    }`}>
      {/* Product Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-xl font-semibold truncate ${
          isReserved ? 'text-gray-500' : 'text-gray-900'
        }`}>
          {product.name}
        </h3>
        {isReserved && (
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-600">
            💝 Reserved
          </div>
        )}
      </div>

      {/* Product Description */}
      <p className={`mb-4 line-clamp-3 ${
        isReserved ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {product.description}
      </p>

      {/* Product URL */}
      {product.url && (
        <div className="mb-4">
          <a 
            href={product.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`text-sm underline truncate block ${
              isReserved 
                ? 'text-gray-400 hover:text-gray-500' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
            title="View product details"
          >
            🔗 View Product Details
          </a>
        </div>
      )}

      {/* Reserved Status */}
      {isReserved && (
        <div className="mb-4 p-3 bg-gray-200 border border-gray-300 rounded-lg">
          <p className="text-gray-600 text-sm font-medium">
            🎁 Someone will bring this gift!
          </p>
        </div>
      )}

      {/* Reserve Button - Only show if not reserved */}
      {!isReserved && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleReserve}
            disabled={isReserving}
            className={`w-full px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              isReserving
                ? 'bg-blue-400 text-white cursor-wait'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            {isReserving ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Reserving...
              </>
            ) : (
              '🎁 I\'ll Buy This!'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
