'use client';

import { useState } from 'react';
import Toast from './Toast';

interface Order {
  id: string;
  nomComplet: string;
  telephone: string;
  adresse: string;
  gpsLocation?: {
    lat: number;
    lng: number;
    address?: string;
  };
  prescriptionUrl?: string;
  medicaments?: string;
  typeLivraison: 'normale' | 'urgente';
  prixLivraison?: number;
  statut: 'pending' | 'validated' | 'out-for-delivery' | 'delivered';
  dateCreation: any;
  review?: {
    rating: number;
    comment: string;
    deliveryRating: number;
    timeRating: number;
    createdAt: any;
  };
}

interface OrdersListProps {
  orders: Order[];
  filterStatus: string;
  onFilterChange: (status: string) => void;
  onOrderSelect: (order: Order) => void;
}

const statusConfig = {
  pending: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳'
  },
  validated: {
    label: 'Validée',
    color: 'bg-blue-100 text-blue-800',
    icon: '✅'
  },
  'out-for-delivery': {
    label: 'En livraison',
    color: 'bg-purple-100 text-purple-800',
    icon: '🚚'
  },
  delivered: {
    label: 'Livrée',
    color: 'bg-green-100 text-green-800',
    icon: '🎉'
  }
};

export default function OrdersList({ orders, filterStatus, onFilterChange, onOrderSelect }: OrdersListProps) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleCopyMapsLink = async (order: Order) => {
    try {
      let mapsLink;
      if (order.gpsLocation && 
          order.gpsLocation.lat && 
          order.gpsLocation.lng && 
          !isNaN(Number(order.gpsLocation.lat)) && 
          !isNaN(Number(order.gpsLocation.lng)) && 
          order.gpsLocation.address) {
        mapsLink = `https://www.google.com/maps?q=${Number(order.gpsLocation.lat).toFixed(6)},${Number(order.gpsLocation.lng).toFixed(6)}`;
      } else {
        mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.adresse)}`;
      }
      await navigator.clipboard.writeText(mapsLink);
      setToast({ message: 'Lien Google Maps copié !', type: 'success' });
    } catch (error) {
      setToast({ message: 'Erreur lors de la copie', type: 'error' });
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    try {
      return date.toDate ? date.toDate().toLocaleString('fr-FR') : new Date(date).toLocaleString('fr-FR');
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header with filter */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
            Commandes ({orders.length})
          </h2>
          
          <div className="flex items-center space-x-4">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
              Filtrer par statut:
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="validated">Validées</option>
              <option value="out-for-delivery">En livraison</option>
              <option value="delivered">Livrées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adresse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2 text-sm">Aucune commande trouvée</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {order.nomComplet}
                        {order.review && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {order.review.rating}/5
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.typeLivraison === 'urgente' ? 'Livraison urgente' : 'Livraison normale'}
                      {order.prixLivraison && ` - ${order.prixLivraison} DH`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.telephone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      <div className="flex items-center space-x-1">
                        <span className="truncate">
                          {order.gpsLocation && 
                           order.gpsLocation.lat && 
                           order.gpsLocation.lng && 
                           !isNaN(Number(order.gpsLocation.lat)) && 
                           !isNaN(Number(order.gpsLocation.lng)) && 
                           order.gpsLocation.address
                            ? order.gpsLocation.address
                            : order.adresse}
                        </span>
                        <div className="flex space-x-1 flex-shrink-0">
                          <a
                            href={order.gpsLocation && 
                                  order.gpsLocation.lat && 
                                  order.gpsLocation.lng && 
                                  !isNaN(Number(order.gpsLocation.lat)) && 
                                  !isNaN(Number(order.gpsLocation.lng))
                              ? `https://www.google.com/maps?q=${Number(order.gpsLocation.lat).toFixed(6)},${Number(order.gpsLocation.lng).toFixed(6)}`
                              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.adresse)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-1 py-0.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            title="Ouvrir dans Google Maps"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <button
                            onClick={() => handleCopyMapsLink(order)}
                            className="inline-flex items-center px-1 py-0.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            title="Copier le lien Google Maps"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.statut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.dateCreation)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onOrderSelect(order)}
                      className="text-green-600 hover:text-green-900 transition-colors"
                    >
                      Voir détails
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
} 