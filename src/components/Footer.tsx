import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-8">
              <Logo className="w-16 h-16 mr-6" />
              <h3 className="text-3xl font-bold">Pharmarapide</h3>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              Pharmarapide est une entreprise marocaine spécialisée dans la livraison rapide 
              de médicaments. Nous nous engageons à fournir un service fiable et rapide 
              pour répondre à vos besoins médicaux urgents.
            </p>
            <p className="text-green-400 font-semibold text-lg">
              Pharmarapide est une entreprise marocaine.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-8">Liens rapides</h4>
            <ul className="space-y-4">
              <li>
                <a href="#hero" className="text-gray-300 hover:text-green-400 transition-colors text-lg">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#commander" className="text-gray-300 hover:text-green-400 transition-colors text-lg">
                  Commander
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-green-400 transition-colors text-lg">
                  À propos
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-green-400 transition-colors text-lg">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-8">Contact</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-lg">+212 619 834 123</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-lg">contact@pharmarapide.ma</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">Technopark Tanger, Maroc</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-16 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-lg mb-6 md:mb-0">
              © 2024 Pharmarapide. Tous droits réservés.
            </div>
            <div className="flex space-x-8 text-lg">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Politique de confidentialité
              </a>
              {/* Hidden admin link - only visible to those who know where to look */}
              <a 
                href="/admin" 
                className="text-gray-600 hover:text-green-400 transition-colors opacity-20 hover:opacity-100"
                title="Admin Access"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 