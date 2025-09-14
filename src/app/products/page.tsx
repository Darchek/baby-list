"use client";
import ProductCard from '@/components/ProductCard';
import { getDictionary } from "@/lib/i18n";
import { useEffect, useState } from 'react';
import { Product } from '@/lib/database';
import { useUserStore } from '@/store/userStore';
import { getProductList, reserveProduct } from '@/lib/fetch';
import NotAuthorized from '@/components/NotAuthorized';

export default function ProductsPage() {
    const dictionary = getDictionary();
    const [products, setProducts] = useState<Product[]>([]);
    const { user } = useUserStore();

    useEffect(() => {
      getActiveProducts();
    }, []);

  const getActiveProducts = async () => {
    const data = await getProductList();
    setProducts(data);
  }

  const onReserveProduct = async (id: number) => {
    const data = await reserveProduct(id);
    getActiveProducts();
  }

      
  if (!user) {
    return <NotAuthorized />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🍼{dictionary.home.title}</h1>
          <p className="text-gray-600">{dictionary.home.description}</p>
          <div className="mt-4 text-sm text-gray-500">
            {products.length} gift{products.length !== 1 ? 's' : ''} on the wishlist
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onReserve={() => onReserveProduct(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍼</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No gifts on the list yet</h3>
            <p className="text-gray-600">The wishlist is being prepared. Check back soon!</p>
          </div>
        )}

        
      </div>
    </div>
  );
}
