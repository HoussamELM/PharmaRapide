'use client';

export default function HowItWorks() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comment ça marche ?
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Trois étapes simples pour recevoir vos médicaments rapidement et en toute sécurité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Step 1 */}
          <div className="group text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <span className="text-4xl">📋</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Téléchargez votre ordonnance</h3>
            <p className="text-gray-600 leading-relaxed">
              Si nécessaire, téléchargez votre ordonnance médicale directement sur notre plateforme sécurisée.
            </p>
          </div>

          {/* Step 2 */}
          <div className="group text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <span className="text-4xl">📍</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Entrez vos informations</h3>
            <p className="text-gray-600 leading-relaxed">
              Remplissez le formulaire avec vos informations personnelles et votre adresse de livraison.
            </p>
          </div>

          {/* Step 3 */}
          <div className="group text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <span className="text-4xl">🚚</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Recevez vos médicaments</h3>
            <p className="text-gray-600 leading-relaxed">
              Nous vous livrons vos médicaments rapidement à votre porte, en toute sécurité.
            </p>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/commander"
            className="group inline-flex items-center px-10 py-5 border border-transparent text-xl font-semibold rounded-2xl text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Commencer maintenant
            <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 