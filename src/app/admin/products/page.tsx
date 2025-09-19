"use client";
import { getDictionary } from "@/lib/i18n";
import { useUserStore } from '@/store/userStore';
import NotAuthorized from '@/components/NotAuthorized';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/database';
import { getProductAllList, updateProduct } from '@/lib/fetch';
import AddProduct from "@/components/AddProduct";
import EditProduct from "@/components/EditProduct";

export default function AdminProductPage() {
    const dictionary = getDictionary();
    const { user } = useUserStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);


    useEffect(() => {
      if (user && user?.id <= 3) {
        getProducts();
      }
    }, [user]);

    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await getProductAllList();
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const startEdit = (product: Product) => {
      setEditingProduct(product);
      setIsModalOpen(true);
    };
    
    const toggleActive = async (productId: number, currentActive: boolean) => {
      try {
        
        const {data, error} = await updateProduct(productId, {active: !currentActive});

        if (data) {
          await getProducts();
        } else {
          alert('Failed to update product status');
        }
      } catch (error) {
        console.error('Error updating product status:', error);
        alert('Failed to update product status');
      }
    };

  if (!user || user?.id > 3) {
    return <NotAuthorized />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[76px]">
      <div className="container mx-auto px-4 py-8">

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {products.length} total products • {products.filter(p => p.active).length} active • {products.filter(p => p.reserved_by).length} reserved
                </p>
              </div>
              <button 
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
                Afegeix producte
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">📦</div>
              <p className="text-gray-600">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reserved
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className={product.active ? '' : 'bg-gray-50'}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 mt-1">{product.description}</div>
                          {product.url && (
                            <a href={product.url} target="_blank" rel="noopener noreferrer" 
                               className="text-xs text-blue-600 hover:text-blue-800 mt-1 block">
                              🔗 View Product
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(product.id, product.active)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.active 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {product.active ? '✅ Active' : '❌ Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.reserved_by ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-800">
                            💝 Reserved
                          </span>
                        ) : (
                          <span className="text-gray-400">Available</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => startEdit(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {isModalOpen && editingProduct && (
       <EditProduct 
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onProductEdited={getProducts}
        />
      )}

      {isAddModalOpen && (
        <AddProduct 
          onClose={() => setIsAddModalOpen(false)}
          onProductAdded={getProducts}
        />
      )}
    </div>
  );
}
