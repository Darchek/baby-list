
'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/database';
import { updateProduct } from '@/lib/fetch';

interface EditProduct {
  product: Product;
  onClose: () => void;
  onProductEdited: () => void;
}

export default function EditProduct({ product, onClose, onProductEdited }: EditProduct) {


    const [editForm, setEditForm] = useState<Partial<Product>>({});
    const [isSaving, setIsSaving] = useState(false);

    const isReserved = product.reserved_by !== null && product.reserved_by !== undefined;
    
    useEffect(() => {
        setEditForm({
            name: product.name,
            description: product.description,
            url: product.url,
            image_url: product.image_url,
            active: product.active,
            reserved_by: product.reserved_by
        });
    }, [product]);

    const closeModal = () => {
        onClose();
    };

    const saveEdit = async () => {
        if (!product) return;
        
        try {
        setIsSaving(true);
        editForm.reserved_by = !editForm.reserved_by ? null : product.reserved_by;
        const { data, error } = await updateProduct(product.id, editForm);
        if (data) {
            await onProductEdited();
            closeModal();
        } else {
            alert('Failed to update product');
        }
        } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product');
        } finally {
        setIsSaving(false);
        }
    };
    

    return  <div className="fixed inset-0 bg-fuchsia-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      {/* Modal Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            ✏️ Edit Product
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Modal Body */}
      <div className="px-6 py-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            value={editForm.name || ''}
            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={editForm.description || ''}
            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            rows={3}
            placeholder="Enter product description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product URL
          </label>
          <input
            type="url"
            value={editForm.url || ''}
            onChange={(e) => setEditForm({...editForm, url: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="https://example.com/product"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={editForm.image_url || ''}
            onChange={(e) => setEditForm({...editForm, image_url: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="https://example.com/image/product"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={editForm.active || false}
              onChange={(e) => setEditForm({...editForm, active: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Active (visible to users)
            </span>
          </label>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              disabled={!isReserved}
              checked={editForm.reserved_by !== null && editForm.reserved_by !== undefined}
              onChange={(e) => setEditForm({...editForm, reserved_by: e.target.checked ? product.reserved_by : null})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Reserved by (Keep or remove)
            </span>
          </label>
        </div>

      </div>

      {/* Modal Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          onClick={closeModal}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={saveEdit}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              Saving...
            </>
          ) : (
            '💾 Save Changes'
          )}
        </button>
      </div>
    </div>
  </div>

}