'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { uploadImageToImgBB } from '@/lib/imgbb';
import app from '@/lib/firebase';
import Logo from '@/components/Logo';
import LocationButton from '@/components/LocationButton';

interface OrderFormData {
  nomComplet: string;
  telephone: string;
  adresse: string;
  prescriptionUrl: string;
  medicaments: string;
  typeLivraison: 'normale' | 'urgente';
}

export default function CommanderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);


  const [formData, setFormData] = useState<OrderFormData>({
    nomComplet: '',
    telephone: '',
    adresse: '',
    prescriptionUrl: '',
    medicaments: '',
    typeLivraison: 'normale'
  });

  const deliveryTypes = {
    normale: {
      label: 'Livraison normale',
      time: '30min-1h',
      price: 30,
      description: 'Livraison standard dans les 30 minutes à 1 heure'
    },
    urgente: {
      label: 'Livraison urgente',
      time: '15-20min',
      price: 50,
      description: 'Livraison express dans les 15 à 20 minutes (selon la localisation)'
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      typeLivraison: e.target.value as 'normale' | 'urgente'
    }));
  };

  const handleLocationUpdate = (address: string) => {
    setFormData(prev => ({
      ...prev,
      adresse: address
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  



  const testFirebase = async () => {
    console.log('=== Firebase Debug Test ===');
    try {
      const db = getFirestore(app);
      console.log('✅ Firestore instance created successfully');
      
      // Test if we can read from Firestore (this will help identify permission issues)
      console.log('Testing Firestore read access...');
      const testQuery = await getDocs(collection(db, 'orders'));
      console.log('✅ Firestore read test successful, found', testQuery.size, 'documents');
      
      // Test if we can write to Firestore
      console.log('Testing Firestore write access...');
      const testDoc = await addDoc(collection(db, 'test'), {
        test: true,
        timestamp: serverTimestamp()
      });
      console.log('✅ Firestore write test successful, created document:', testDoc.id);
      
      // Clean up test document
      console.log('Cleaning up test document...');
      await deleteDoc(doc(db, 'test', testDoc.id));
      console.log('✅ Test document cleaned up successfully');
      
    } catch (error) {
      console.error('❌ Firebase test failed:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
    }
  };

  const validateForm = (): boolean => {
    if (!formData.nomComplet.trim()) {
      alert('Le nom complet est requis.');
      return false;
    }
    
    if (!formData.telephone.trim()) {
      alert('Le numéro de téléphone est requis.');
      return false;
    }
    
    // Validate Moroccan phone number format
    const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
    if (!phoneRegex.test(formData.telephone.replace(/\s/g, ''))) {
      alert('Veuillez entrer un numéro de téléphone marocain valide (ex: +212600000000 ou 0600000000).');
      return false;
    }
    
    if (!formData.adresse.trim()) {
      alert('L\'adresse est requise.');
      return false;
    }
    
    // Check if either prescription or medicine text is provided
    if (!formData.medicaments.trim() && !imageFile) {
      alert('Veuillez soit télécharger une ordonnance, soit indiquer les médicaments demandés.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    console.log('Starting order submission...');
    
    try {
      let prescriptionUrl = '';
      
      // Upload image if provided
      if (imageFile) {
        console.log('Uploading image...');
        try {
          const imgbbResponse = await uploadImageToImgBB(imageFile);
          prescriptionUrl = imgbbResponse.data.url;
          console.log('Image uploaded successfully:', prescriptionUrl);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          alert('Erreur lors du téléchargement de l\'image. Veuillez réessayer.');
          setLoading(false);
          return;
        }
      } else {
        console.log('No image to upload');
      }
      
      // Save order to Firestore
      console.log('Saving order to Firestore...');
      const db = getFirestore(app);
      console.log('Firestore instance created');
      
      const orderData = {
        nomComplet: formData.nomComplet.trim(),
        telephone: formData.telephone.trim(),
        adresse: formData.adresse.trim(),
        prescriptionUrl,
        medicaments: formData.medicaments.trim() || '',
        typeLivraison: formData.typeLivraison,
        prixLivraison: deliveryTypes[formData.typeLivraison].price,
        statut: 'pending',
        dateCreation: serverTimestamp()
      };
      
      console.log('Order data prepared:', orderData);
      console.log('Adding document to Firestore...');
      
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      console.log('Order saved successfully with ID:', docRef.id);
      
      setOrderId(docRef.id);
      setSuccess(true);
      
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Erreur lors de la création de la commande. Veuillez réessayer.';
      
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        
        if (error.message.includes('permission')) {
          errorMessage = 'Erreur de permissions. Veuillez vérifier votre connexion et réessayer.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Erreur de réseau. Veuillez vérifier votre connexion internet et réessayer.';
        } else if (error.message.includes('firestore')) {
          errorMessage = 'Erreur de base de données. Veuillez réessayer dans quelques instants.';
        } else {
          errorMessage = `Erreur: ${error.message}. Veuillez réessayer.`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
      console.log('Order submission process completed');
    }
  };

  if (success && orderId) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Logo className="mx-auto h-16 w-16 mb-6" />
            <div className="mx-auto h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Commande Enregistrée !
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Votre commande a été enregistrée avec succès. Vous pouvez suivre son statut en temps réel.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Numéro de commande :</p>
              <p className="font-mono text-lg font-bold text-gray-900">{orderId}</p>
            </div>
            
            <div className="space-y-4">
              <a
                href={`/suivi/${orderId}`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Suivre ma commande
              </a>
              
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Logo className="mx-auto h-16 w-16 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Commander vos médicaments
            </h1>
            <p className="text-gray-600">
              Remplissez le formulaire ci-dessous pour passer votre commande
            </p>
          </div>



          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom complet */}
            <div>
              <label htmlFor="nomComplet" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                id="nomComplet"
                name="nomComplet"
                value={formData.nomComplet}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500"
                placeholder="Votre nom complet"
                required
              />
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone *
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500"
                placeholder="+212600000000 ou 0600000000"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Format marocain : +212600000000 ou 0600000000
              </p>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse de livraison *
              </label>
              <textarea
                id="adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                rows={3}
                required
                placeholder="Entrez votre adresse complète (ex: 123 Rue Hassan II, Tanger, Maroc)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              
              {/* Location Button */}
              <div className="mt-3">
                <LocationButton 
                  onLocationUpdate={handleLocationUpdate}
                  compact={true}
                />
              </div>
            </div>

            {/* Upload prescription */}
            <div>
              <label htmlFor="prescription" className="block text-sm font-medium text-gray-700 mb-2">
                Ordonnance (optionnel)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Aperçu de l'ordonnance"
                        className="mx-auto h-32 w-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-500"
                      >
                        Supprimer l'image
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="prescription" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                          <span>Télécharger un fichier</span>
                          <input
                            id="prescription"
                            name="prescription"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Medicine Input */}
            <div>
              <label htmlFor="medicaments" className="block text-sm font-medium text-gray-700 mb-2">
                Médicaments demandés (optionnel)
              </label>
              <textarea
                id="medicaments"
                name="medicaments"
                value={formData.medicaments}
                onChange={handleInputChange}
                rows={4}
                placeholder="Listez vos médicaments (ex: Paracétamol 500mg, Ibuprofène 400mg, Vitamine C...) - Optionnel si vous avez une ordonnance"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              
              {/* Warning about prescription medicines */}
              <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Important : Médicaments sur ordonnance
                    </h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        Si vous demandez des médicaments qui nécessitent une ordonnance (antibiotiques, 
                        médicaments psychotropes, etc.), nous ne pourrons pas les livrer sans ordonnance valide.
                      </p>
                      <p className="mt-2 font-medium">
                        💡 Conseil : Vous pouvez soit télécharger votre ordonnance, soit lister vos médicaments ici, ou faire les deux.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Type de livraison */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de livraison *
              </label>
              <div className="space-y-4">
                {Object.entries(deliveryTypes).map(([key, delivery]) => (
                  <div key={key} className="relative">
                    <input
                      id={key}
                      name="typeLivraison"
                      type="radio"
                      value={key}
                      checked={formData.typeLivraison === key}
                      onChange={handleRadioChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={key}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.typeLivraison === key
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            formData.typeLivraison === key
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300'
                          }`}>
                            {formData.typeLivraison === key && (
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{delivery.label}</div>
                            <div className="text-sm text-gray-600">{delivery.description}</div>
                            <div className="text-sm text-gray-500">Délai: {delivery.time}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{delivery.price} DH</div>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Traitement en cours...
                  </div>
                ) : (
                  `Valider ma commande - ${deliveryTypes[formData.typeLivraison].price} DH`
                )}
              </button>
              
              {/* Debug button - remove in production */}
              <button
                type="button"
                onClick={testFirebase}
                className="mt-2 w-full flex justify-center py-2 px-4 border border-red-300 rounded-md shadow-sm text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Debug Firebase
              </button>
            </div>
          </form>
        </div>
      </div>
      
      
    </div>
  );
} 