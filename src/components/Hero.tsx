'use client';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-24 bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Pharmarapide
                <span className="block text-green-600">Livraison rapide</span>
                <span className="block text-gray-700 text-4xl md:text-5xl lg:text-6xl">de vos médicaments</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                En cas d'urgence ou en pharmacie de garde, nous vous livrons vos médicaments 
                rapidement et en toute sécurité partout au Maroc.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <a
                href="/commander"
                className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-2xl text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Commander maintenant
                <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              
              <button
                onClick={() => {
                  const element = document.getElementById('about');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-lg font-semibold rounded-2xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                En savoir plus
              </button>
            </div>
          </div>
          
          {/* Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="relative w-96 h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl flex items-center justify-center shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="text-8xl mb-6">💊</div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-green-600">Pharmarapide</div>
                    <div className="text-lg text-green-500 font-medium">Livraison rapide</div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-3xl">🚚</span>
                </div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="absolute top-1/2 -left-8 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shadow-lg animate-ping">
                  <span className="text-lg">❤️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 