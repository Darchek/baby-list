'use client';

import { getDictionary } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { geminiGenerateText } from '@/lib/fetch';

export default function Home() {
  const dictionary = getDictionary();
  const router = useRouter();

  const [genText, setGenText] = useState('');

  const goToProducts = () => {
    router.push('/products');
  };

  useEffect(() => {
    generateText();
  }, []);

  const generateText = async () => {
    const text = await geminiGenerateText('')
    setGenText(text);
  }



  return (
    <div className="bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 pt-[76px] h-screen overflow-hidden flex flex-col">
      {/* Welcome Header Section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="text-6xl md:text-8xl mb-4 animate-bounce">🍼</div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {dictionary.home.title}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-blue-400 mx-auto mb-4 rounded-full"></div>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
                {dictionary.welcome.text}
              </p>
            </div>
            
            {/* Decorative elements */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <span className="text-2xl md:text-3xl animate-pulse">🎁</span>
              <span className="text-lg md:text-2xl text-pink-400">•</span>
              <span className="text-2xl md:text-3xl animate-pulse delay-100">👶</span>
              <span className="text-lg md:text-2xl text-blue-400">•</span>
              <span className="text-2xl md:text-3xl animate-pulse delay-200">💝</span>
            </div>
            
            {/* Button */}
            <div className="text-center">
              <a
                onClick={goToProducts}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold text-lg rounded-full hover:from-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="mr-3 text-2xl">🎁</span>
                {dictionary.welcome.button}
                <span className="ml-3 text-xl">→</span>
              </a>
            </div>
            {genText && (
              <div className="mt-12 max-w-3xl mx-auto">
                <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-6 border border-pink-100 shadow-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">✨</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium italic">
                        {genText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      
    </div>
  );
}
