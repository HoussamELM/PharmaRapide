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

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
  onStatusUpdate: (orderId: string, newStatus: 'validated' | 'out-for-delivery' | 'delivered') => void;
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

export default function OrderDetails({ order, onBack, onStatusUpdate }: OrderDetailsProps) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleCall = () => {
    window.open(`tel:${order.telephone}`, '_blank');
  };

  const handleCopyAddress = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: `${type} copié dans le presse-papiers !`, type: 'success' });
    } catch (error) {
      setToast({ message: 'Erreur lors de la copie', type: 'error' });
    }
  };

  const handleCopyMapsLink = async (address: string, isGPS: boolean = false) => {
    try {
      let mapsLink;
      if (isGPS && order.gpsLocation) {
        mapsLink = `https://www.google.com/maps?q=${Number(order.gpsLocation.lat).toFixed(6)},${Number(order.gpsLocation.lng).toFixed(6)}`;
      } else {
        mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      }
      await navigator.clipboard.writeText(mapsLink);
      setToast({ message: 'Lien Google Maps copié dans le presse-papiers !', type: 'success' });
    } catch (error) {
      setToast({ message: 'Erreur lors de la copie', type: 'error' });
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return 'validated';
      case 'validated':
        return 'out-for-delivery';
      case 'out-for-delivery':
        return 'delivered';
      default:
        return null;
    }
  };

  const getStatusButtonText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return 'Confirmer la commande';
      case 'validated':
        return 'Marquer en livraison';
      case 'out-for-delivery':
        return 'Marquer comme livrée';
      default:
        return '';
    }
  };

  const nextStatus = getNextStatus(order.statut);
  const currentStatusConfig = statusConfig[order.statut];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Détails de la commande</h2>
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatusConfig.color}`}>
          <span className="mr-2">{currentStatusConfig.icon}</span>
          {currentStatusConfig.label}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Client Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations client</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                <p className="mt-1 text-sm text-gray-900">{order.nomComplet}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <div className="mt-1 flex items-center space-x-2">
                  <p className="text-sm text-gray-900">{order.telephone}</p>
                  <button
                    onClick={handleCall}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Appeler
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <div className="mt-1 flex items-center space-x-2">
                  <p className="text-sm text-gray-900 flex-1">
                    {order.gpsLocation && 
                     order.gpsLocation.lat && 
                     order.gpsLocation.lng && 
                     !isNaN(Number(order.gpsLocation.lat)) && 
                     !isNaN(Number(order.gpsLocation.lng)) && 
                     order.gpsLocation.address
                      ? order.gpsLocation.address
                      : order.adresse}
                  </p>
                  <div className="flex space-x-1">
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
                      className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      title="Ouvrir dans Google Maps"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Maps
                    </a>
                    <button
                      onClick={() => {
                        if (order.gpsLocation && 
                            order.gpsLocation.lat && 
                            order.gpsLocation.lng && 
                            !isNaN(Number(order.gpsLocation.lat)) && 
                            !isNaN(Number(order.gpsLocation.lng)) && 
                            order.gpsLocation.address) {
                          handleCopyMapsLink(order.gpsLocation.address, true);
                        } else {
                          handleCopyMapsLink(order.adresse, false);
                        }
                      }}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      title="Copier le lien Google Maps"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copier
                    </button>
                  </div>
                </div>
              </div>

              {order.medicaments && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Médicaments demandés</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{order.medicaments}</p>
                  </div>
                </div>
              )}



              <div>
                <label className="block text-sm font-medium text-gray-700">Type de livraison</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {order.typeLivraison === 'urgente' ? 'Livraison urgente' : 'Livraison normale'}
                </p>
              </div>

              {order.prixLivraison && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prix de livraison</label>
                  <p className="mt-1 text-sm text-gray-900 font-semibold">
                    {order.prixLivraison} DH
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Date de création</label>
                <p className="mt-1 text-sm text-gray-900">
                  {order.dateCreation?.toDate ? 
                    order.dateCreation.toDate().toLocaleString('fr-FR') : 
                    'Date non disponible'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Prescription Image */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ordonnance</h3>
          
          {order.prescriptionUrl ? (
            <div>
              <img
                src={order.prescriptionUrl}
                alt="Ordonnance"
                className="w-full h-auto rounded-lg shadow-md"
              />
              <p className="mt-2 text-sm text-gray-600">
                Ordonnance téléchargée avec la commande
              </p>
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Aucune ordonnance téléchargée</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Section */}
      {order.review && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Avis client</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`h-5 w-5 ${i < order.review!.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                Note globale: {order.review.rating}/5
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Rapidité de livraison</label>
                <div className="flex text-yellow-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`h-4 w-4 ${i < order.review!.timeRating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Service du livreur</label>
                <div className="flex text-yellow-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`h-4 w-4 ${i < order.review!.deliveryRating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            
            {order.review.comment && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Commentaire</label>
                <p className="mt-1 text-sm text-gray-900 italic">"{order.review.comment}"</p>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-medium">Date de l'avis:</span> {
                order.review.createdAt?.toDate ? 
                  order.review.createdAt.toDate().toLocaleDateString('fr-FR') : 
                  'Date non disponible'
              }
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-4">
          {nextStatus && (
            <button
              onClick={() => onStatusUpdate(order.id, nextStatus as 'validated' | 'out-for-delivery' | 'delivered')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              {getStatusButtonText(order.statut)}
            </button>
          )}
          
          {order.statut === 'delivered' && (
            <div className="inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Commande livrée
            </div>
          )}
        </div>
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