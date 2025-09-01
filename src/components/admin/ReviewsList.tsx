'use client';

import { useEffect, useState } from 'react';
import { getFirestore, collection, query, getDocs, orderBy } from 'firebase/firestore';
import app from '@/lib/firebase';

interface Review {
  id: string;
  nomComplet: string;
  telephone: string;
  adresse: string;
  typeLivraison: 'normale' | 'urgente';
  prixLivraison?: number;
  statut: string;
  dateCreation: any;
  review: {
    rating: number;
    comment: string;
    deliveryRating: number;
    timeRating: number;
    createdAt: any;
  };
}

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const db = getFirestore(app);
        const ordersRef = collection(db, 'orders');
        
        // Get all orders with reviews, ordered by review date
        const q = query(
          ordersRef,
          orderBy('review.createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const reviewsData: Review[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.review) {
            reviewsData.push({
              id: doc.id,
              nomComplet: data.nomComplet,
              telephone: data.telephone,
              adresse: data.adresse,
              typeLivraison: data.typeLivraison,
              prixLivraison: data.prixLivraison,
              statut: data.statut,
              dateCreation: data.dateCreation,
              review: data.review
            });
          }
        });

        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(review => {
    if (filter === 'positive') return review.review.rating >= 4;
    if (filter === 'negative') return review.review.rating < 4;
    return true;
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.review.rating, 0) / reviews.length 
    : 0;

  const averageTimeRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.review.timeRating, 0) / reviews.length 
    : 0;

  const averageDeliveryRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.review.deliveryRating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des avis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Avis clients</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{reviews.length}</div>
            <div className="text-sm text-gray-600">Total avis</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Note moyenne</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{averageTimeRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Rapidité moyenne</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{averageDeliveryRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Service livreur</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'all' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('positive')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'positive' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Positifs ({reviews.filter(r => r.review.rating >= 4).length})
          </button>
          <button
            onClick={() => setFilter('negative')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'negative' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Négatifs ({reviews.filter(r => r.review.rating < 4).length})
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Détails des avis ({filteredReviews.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredReviews.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun avis</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' 
                  ? 'Aucun avis client pour le moment.' 
                  : `Aucun avis ${filter === 'positive' ? 'positif' : 'négatif'} pour le moment.`
                }
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{review.nomComplet}</h4>
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {review.typeLivraison === 'urgente' ? 'Urgente' : 'Normale'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Téléphone:</span> {review.telephone}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Adresse:</span> {review.adresse}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Prix:</span> {review.prixLivraison} DH
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Statut:</span> {review.statut}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Date commande:</span> {
                            review.dateCreation?.toDate ? 
                              review.dateCreation.toDate().toLocaleDateString('fr-FR') : 
                              'N/A'
                          }
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Date avis:</span> {
                            review.review.createdAt?.toDate ? 
                              review.review.createdAt.toDate().toLocaleDateString('fr-FR') : 
                              'N/A'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Ratings */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Note globale</label>
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`h-4 w-4 ${i < review.review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{review.review.rating}/5</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rapidité</label>
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`h-4 w-4 ${i < review.review.timeRating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{review.review.timeRating}/5</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service livreur</label>
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`h-4 w-4 ${i < review.review.deliveryRating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{review.review.deliveryRating}/5</span>
                        </div>
                      </div>
                    </div>

                    {/* Comment */}
                    {review.review.comment && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                        <p className="text-gray-900 italic">"{review.review.comment}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 