'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import app from '@/lib/firebase';
import { isAuthorizedAdmin } from '@/lib/adminAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import OrdersList from '@/components/admin/OrdersList';
import OrderDetails from '@/components/admin/OrderDetails';
import ReviewsList from '@/components/admin/ReviewsList';
import Logo from '@/components/Logo';

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
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentView, setCurrentView] = useState<'orders' | 'reviews'>('orders');
  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if the user is an authorized admin
        if (isAuthorizedAdmin(user.email)) {
          setUser(user);
          fetchOrders();
        } else {
          setUnauthorized(true);
          // Sign out unauthorized users
          signOut(auth);
        }
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  const fetchOrders = async () => {
    try {
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      // Sort by creation date (newest first)
      ordersData.sort((a, b) => b.dateCreation?.toDate() - a.dateCreation?.toDate());
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: 'validated' | 'out-for-delivery' | 'delivered') => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        statut: newStatus
      });
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, statut: newStatus } : order
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, statut: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.statut === filterStatus
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-red-800">Accès non autorisé</h3>
            <p className="mt-2 text-sm text-red-600">
              Votre compte n'a pas les autorisations nécessaires pour accéder au tableau de bord administrateur.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        onLogout={handleLogout}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Logo className="w-10 h-10 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Admin</h1>
                  <p className="text-gray-600 mt-2">
                    Bienvenue, {user.displayName || user.email}
                  </p>
                </div>
              </div>
            </div>

            {currentView === 'orders' ? (
              selectedOrder ? (
                <OrderDetails 
                  order={selectedOrder}
                  onBack={() => setSelectedOrder(null)}
                  onStatusUpdate={handleStatusUpdate}
                />
              ) : (
                <OrdersList 
                  orders={filteredOrders}
                  filterStatus={filterStatus}
                  onFilterChange={setFilterStatus}
                  onOrderSelect={setSelectedOrder}
                />
              )
            ) : (
              <ReviewsList />
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 