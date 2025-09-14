
import { Product } from '@/lib/database';
import { useState } from 'react';

interface ReserveSureProps {
  product: Product;
  onReserve: () => void;
  onCancel: () => void;
  loading?: boolean;
  setIsReserving: (value: boolean) => void;
}

export default function ReserveSure({ product, onReserve, onCancel, loading = false, setIsReserving }: ReserveSureProps) {

    const isReserved = !!product.reserved_by;

    const handleReserve = async () => {
        if (isReserved || !onReserve) return;
        
        setIsReserving(true);
        try {
          await onReserve();
        } catch (error) {
          console.error('Failed to reserve product:', error);
        } finally {
          setIsReserving(false);
        }
    };


  return (
    <div 
      className="fixed inset-0 bg-fuchsia-50/50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Confirmar Reserva</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Product Info */}
          <div className="mb-6">
            <div className="flex items-start space-x-4">
              {product?.image_url && (
                <div className="flex-shrink-0">
                  <img 
                    src={product?.image_url} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Estàs segur que vols reservar aquest regal?
                </h4>
                <p className="text-sm text-blue-700">
                  Una vegada reservat, altres persones no podran seleccionar aquest producte
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              Cancel·lar
            </button>
            <button
              type="button"
              onClick={handleReserve}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reservant...
                </div>
              ) : (
                'Sí, Reservar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
