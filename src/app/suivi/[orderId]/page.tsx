'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import app from '@/lib/firebase';
import Logo from '@/components/Logo';

interface Order {
  id: string;
  nomComplet: string;
  telephone: string;
  adresse: string;
  prescriptionUrl?: string;
  medicaments: string;
  typeLivraison: 'normale' | 'urgente';
  prixLivraison: number;
  statut: 'pending' | 'validated' | 'out-for-delivery' | 'delivered';
  dateCreation: any;
  gpsLocation?: {
    lat: number;
    lng: number;
  };
  review?: {
    rating: number;
    comment: string;
    deliveryRating: number;
    timeRating: number;
    createdAt: any;
  };
}

const statusConfig = {
  pending: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
    description: 'Votre commande est en cours de traitement'
  },
  validated: {
    label: 'Validée',
    color: 'bg-blue-100 text-blue-800',
    icon: '✅',
    description: 'Votre commande a été validée et est en préparation'
  },
  'out-for-delivery': {
    label: 'En livraison',
    color: 'bg-purple-100 text-purple-800',
    icon: '🚚',
    description: 'Votre commande est en route vers vous'
  },
  delivered: {
    label: 'Livrée',
    color: 'bg-green-100 text-green-800',
    icon: '🎉',
    description: 'Votre commande a été livrée avec succès'
  }
};

export default function SuiviPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
    deliveryRating: 0,
    timeRating: 0
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError('ID de commande manquant');
      setLoading(false);
      return;
    }

    const db = getFirestore(app);
    const orderRef = doc(db, 'orders', orderId);

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      orderRef,
      (doc) => {
        if (doc.exists()) {
          setOrder({ id: doc.id, ...doc.data() } as Order);
          setError(null);
        } else {
          setError('Commande non trouvée');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching order:', error);
        setError('Erreur lors du chargement de la commande');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [orderId]);

  const handleWhatsApp = () => {
    if (!order) return;
    
    const message = `Bonjour, j'ai une question concernant ma commande ${orderId}.`;
    const whatsappUrl = `https://wa.me/212600000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    try {
      return date.toDate ? date.toDate().toLocaleString('fr-FR') : new Date(date).toLocaleString('fr-FR');
    } catch {
      return 'N/A';
    }
  };

  const handleReviewSubmit = async () => {
    if (!order || reviewData.rating === 0) return;
    
    setSubmittingReview(true);
    try {
      const db = getFirestore(app);
      const orderRef = doc(db, 'orders', orderId);
      
      await updateDoc(orderRef, {
        review: {
          ...reviewData,
          createdAt: new Date()
        }
      });
      
      setShowReviewForm(false);
      setReviewData({ rating: 0, comment: '', deliveryRating: 0, timeRating: 0 });
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number, onChange: (rating: number) => void, disabled = false) => {
    return (
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            className={`h-6 w-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-500 transition-colors`}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Logo className="mx-auto h-16 w-16 mb-6" />
            <div className="mx-auto h-12 w-12 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Erreur
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              {error || 'Impossible de charger votre commande'}
            </p>
            
            <div className="space-y-4">
              <Link
                href="/commander"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Nouvelle commande
              </Link>
              
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentStatus = statusConfig[order.statut];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo className="mx-auto h-16 w-16 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Suivi de votre commande
          </h1>
          <p className="text-lg text-gray-600">
            Numéro de commande : <span className="font-mono font-bold">{orderId}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statut de la commande</h2>
              
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${currentStatus.color} mb-4`}>
                <span className="mr-2 text-lg">{currentStatus.icon}</span>
                {currentStatus.label}
              </div>
              
              <p className="text-gray-600 mb-4">{currentStatus.description}</p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Date de création :</span> {formatDate(order.dateCreation)}</p>
                <p><span className="font-medium">Type de livraison :</span> {order.typeLivraison === 'urgente' ? 'Urgente' : 'Normale'}</p>
                <p><span className="font-medium">Prix de livraison :</span> {order.prixLivraison} DH</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Détails de la commande</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Informations client</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Nom :</span> {order.nomComplet}</p>
                    <p><span className="font-medium">Téléphone :</span> {order.telephone}</p>
                    <p><span className="font-medium">Adresse :</span> {order.adresse}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Médicaments</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {order.medicaments && (
                      <p><span className="font-medium">Description :</span> {order.medicaments}</p>
                    )}
                    {order.prescriptionUrl && (
                      <div>
                        <p className="font-medium mb-2">Ordonnance :</p>
                        <img 
                          src={order.prescriptionUrl} 
                          alt="Ordonnance" 
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        {order.statut === 'delivered' && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Votre avis</h2>
              
              {order.review ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    {renderStars(order.review.rating, () => {}, true)}
                    <span className="ml-2 text-sm text-gray-600">
                      Note globale: {order.review.rating}/5
                    </span>
                  </div>
                  
                  {order.review.comment && (
                    <blockquote className="text-gray-700 mb-4 italic">
                      "{order.review.comment}"
                    </blockquote>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Rapidité de livraison</p>
                      {renderStars(order.review.timeRating, () => {}, true)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Service du livreur</p>
                      {renderStars(order.review.deliveryRating, () => {}, true)}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-4">
                    Avis soumis le {formatDate(order.review.createdAt)}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Votre commande a été livrée ! Partagez votre expérience avec nous.
                  </p>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    Laisser un avis
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Votre avis</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note globale *
                  </label>
                  {renderStars(reviewData.rating, (rating) => setReviewData(prev => ({ ...prev, rating })))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rapidité de livraison
                  </label>
                  {renderStars(reviewData.deliveryRating, (rating) => setReviewData(prev => ({ ...prev, deliveryRating: rating })))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service du livreur
                  </label>
                  {renderStars(reviewData.timeRating, (rating) => setReviewData(prev => ({ ...prev, timeRating: rating })))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commentaire (optionnel)
                  </label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Partagez votre expérience..."
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleReviewSubmit}
                    disabled={reviewData.rating === 0 || submittingReview}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {submittingReview ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Besoin d&apos;aide ?</h2>
            <p className="text-gray-600 mb-6">
              Contactez-nous directement sur WhatsApp pour toute question concernant votre commande.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.87 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Contacter le support WhatsApp
              </button>
              
              <div className="space-x-4">
                <Link
                  href="/commander"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Nouvelle commande
                </Link>
                
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Retour à l&apos;accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 