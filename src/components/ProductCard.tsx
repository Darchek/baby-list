'use client';

import { Product } from '@/lib/database';
import { getDictionary } from '@/lib/i18n';
import { useState } from 'react';
import Image from 'next/image';
import { useUserStore } from '@/store/userStore';

interface ProductCardProps {
  product: Product;
  onReserve?: (product: Product) => Promise<void>;
}

export default function ProductCard({ product, onReserve }: ProductCardProps) {
  const dictionary = getDictionary();
  const { user } = useUserStore();
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
    <div className={`rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border-2 flex flex-col h-full ${
      isReserved 
        ? 'bg-gray-100 border-gray-300' 
        : 'bg-white border-gray-200 hover:border-blue-300'
    }`}>
      
      {/* Header with title and status */}
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-xl font-semibold truncate flex-1 ${
          isReserved ? 'text-gray-500' : 'text-gray-900'
        }`}>
          {product.name}
        </h3>

        {isReserved && (
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-600 ml-2">
            💝 {product.reserved_by === user?.id ? dictionary.products.you_reserved : dictionary.products.reserved}
          </div>
        )}
      </div>

      {/* Content area that grows to fill space */}
      <div className="flex-1 flex flex-col">
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
              title={dictionary.products.view}
            >
              🔗 {dictionary.products.view}
            </a>
          </div>
        )}

        {/* Product Image */}
        {product.image_url && (
          <div className="mb-4 flex justify-center">
            <Image
              src={product.image_url}
              alt={product.name}
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />  
          </div>
        )}

        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* Reserved Status */}
        {isReserved && (
          <div className="p-2 bg-gray-200 border border-gray-300 rounded-lg">
            <p className="text-gray-600 text-sm font-medium">
              🎁 {product.reserved_by === user?.id ? dictionary.products.you_reserved_large : dictionary.products.reserved_large}
            </p>
          </div>
        )}
      </div>

      {/* Button area - always at bottom */}
      {!isReserved && (
        <div className="pt-4 border-t border-gray-200 mt-auto">
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
              '🎁 ' + dictionary.products.select
            )}
          </button>
        </div>
      )}
    </div>
  );
}
