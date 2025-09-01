# Pharmarapide Order System

Système complet de commande et suivi pour les clients Pharmarapide.

## 🚀 Fonctionnalités

### 📝 Page de Commande (`/commander`)
- **Formulaire complet** avec validation
- **Géolocalisation GPS** automatique
- **Upload d'ordonnance** via ImgBB
- **Types de livraison** : Urgente / Normale
- **Validation en temps réel** des champs
- **Sauvegarde Firestore** avec statut initial

### 📊 Page de Suivi (`/suivi/[orderId]`)
- **Suivi en temps réel** des commandes
- **Statuts visuels** avec icônes et couleurs
- **Détails complets** de la commande
- **Support WhatsApp** intégré
- **Mise à jour automatique** des statuts

### 🔧 Dashboard Admin
- **Gestion des statuts** : En attente → Validée → En livraison → Livrée
- **Filtrage par statut** des commandes
- **Détails complets** avec GPS et ordonnance
- **Appel direct** vers les clients
- **Interface responsive** et moderne

## 📁 Structure des Fichiers

```
src/
├── app/
│   ├── commander/
│   │   └── page.tsx              # Page de commande client
│   └── suivi/
│       └── [orderId]/
│           └── page.tsx          # Page de suivi de commande
├── components/
│   └── admin/
│       ├── OrderDetails.tsx      # Détails d'une commande (admin)
│       └── OrdersList.tsx        # Liste des commandes (admin)
└── lib/
    ├── firebase.ts               # Configuration Firebase
    ├── imgbb.ts                  # Configuration ImgBB
    └── adminAuth.ts              # Authentification admin
```

## 🎯 Workflow Utilisateur

### 1. Commande Client
```
Client visite /commander
    ↓
Remplit le formulaire
    ↓
Upload ordonnance (optionnel)
    ↓
Utilise GPS (optionnel)
    ↓
Soumet la commande
    ↓
Redirection vers /suivi/[orderId]
```

### 2. Suivi Client
```
Client visite /suivi/[orderId]
    ↓
Voir statut en temps réel
    ↓
Consulter détails commande
    ↓
Contacter support WhatsApp
```

### 3. Gestion Admin
```
Admin se connecte
    ↓
Voir liste des commandes
    ↓
Filtrer par statut
    ↓
Cliquer sur "Voir détails"
    ↓
Mettre à jour le statut
    ↓
Appeler le client si nécessaire
```

## 🔧 Configuration

### Variables d'Environnement
```env
# Firebase (déjà configuré)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# ImgBB (déjà configuré)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Admin (optionnel)
NEXT_PUBLIC_ADMIN_EMAILS=admin@pharmarapide.ma
```

### Structure Firestore
```typescript
interface Order {
  id: string;                    // Auto-généré
  nomComplet: string;           // Nom complet du client
  telephone: string;            // Format marocain (+212...)
  adresse: string;              // Adresse de livraison
  gpsLocation?: {               // Position GPS (optionnel)
    lat: number;
    lng: number;
  };
  prescriptionUrl?: string;     // URL ImgBB (optionnel)
  typeLivraison: 'urgente' | 'normale';
  statut: 'pending' | 'validated' | 'out-for-delivery' | 'delivered';
  dateCreation: Timestamp;      // Auto-généré
}
```

## 🎨 Interface Utilisateur

### Page de Commande
- **Design moderne** avec validation en temps réel
- **Champs requis** : Nom, téléphone, adresse
- **Champs optionnels** : GPS, ordonnance
- **Validation téléphone** : Format marocain
- **Upload d'image** : Drag & drop + preview
- **Géolocalisation** : Bouton "Utiliser ma position"
- **Types de livraison** : Radio buttons avec prix

### Page de Suivi
- **Statuts visuels** avec icônes et couleurs
- **Informations complètes** de la commande
- **Image d'ordonnance** si disponible
- **Support WhatsApp** avec message pré-rempli
- **Mise à jour temps réel** via Firestore

### Dashboard Admin
- **Tableau responsive** avec filtres
- **Détails complets** par commande
- **Actions rapides** : Appel, mise à jour statut
- **Statuts colorés** pour identification rapide
- **Interface moderne** avec sidebar

## 🔒 Sécurité

### Validation Client
- **Validation côté client** des champs requis
- **Format téléphone** marocain vérifié
- **Taille d'image** limitée (10MB max)
- **Types de fichiers** autorisés uniquement

### Sécurité Admin
- **Authentification Firebase** avec Google
- **Liste blanche** d'emails autorisés
- **Routes protégées** par middleware
- **Accès caché** via footer discret

### Protection des Données
- **Images sécurisées** via ImgBB
- **Données chiffrées** en transit
- **Accès restreint** aux admins autorisés
- **Sauvegarde automatique** Firestore

## 📱 Responsive Design

### Mobile (< 768px)
- **Formulaire adapté** aux écrans tactiles
- **Boutons optimisés** pour le touch
- **Navigation simplifiée**
- **Tableau avec scroll** horizontal

### Tablet (768px - 1023px)
- **Layout adapté** aux tablettes
- **Boutons intermédiaires**
- **Navigation optimisée**

### Desktop (≥ 1024px)
- **Interface complète** avec sidebar
- **Tableau complet** avec toutes les colonnes
- **Actions en ligne** optimisées

## 🧪 Test du Système

### Créer une Commande Test
1. Visitez `http://localhost:3000/commander`
2. Remplissez le formulaire avec des données test
3. Testez l'upload d'image
4. Testez la géolocalisation
5. Soumettez la commande
6. Vérifiez la redirection vers le suivi

### Tester le Suivi
1. Copiez l'ID de commande généré
2. Visitez `http://localhost:3000/suivi/[orderId]`
3. Vérifiez l'affichage des détails
4. Testez le bouton WhatsApp

### Tester l'Admin
1. Connectez-vous à `/admin`
2. Vérifiez l'apparition de la nouvelle commande
3. Testez la mise à jour des statuts
4. Vérifiez le suivi en temps réel

## 🚀 Déploiement

### Build de Production
```bash
npm run build
npm run start
```

### Variables d'Environnement
Assurez-vous que toutes les variables d'environnement sont configurées :
- Firebase (déjà configuré)
- ImgBB (déjà configuré)
- Admin emails (optionnel)

### Vérifications Post-Déploiement
1. **Formulaire de commande** fonctionne
2. **Upload d'images** vers ImgBB
3. **Géolocalisation** dans le navigateur
4. **Sauvegarde Firestore** des commandes
5. **Suivi en temps réel** des statuts
6. **Dashboard admin** accessible
7. **WhatsApp support** fonctionne

## 🔧 Maintenance

### Ajouter de Nouveaux Statuts
1. Modifiez l'interface `Order` dans tous les fichiers
2. Ajoutez la configuration dans `statusConfig`
3. Mettez à jour les composants admin
4. Testez le workflow complet

### Modifier les Champs
1. Mettez à jour l'interface `Order`
2. Modifiez le formulaire de commande
3. Ajustez l'affichage dans le suivi
4. Mettez à jour le dashboard admin

### Optimisations
- **Lazy loading** des images
- **Pagination** des commandes admin
- **Recherche** par nom/téléphone
- **Notifications** push pour les statuts
- **SMS** automatiques pour les mises à jour

## 📞 Support

### Problèmes Courants
- **Géolocalisation** : Vérifiez les permissions navigateur
- **Upload d'image** : Vérifiez la taille et le format
- **Validation téléphone** : Format marocain requis
- **Connexion admin** : Email dans la liste blanche

### Debug
- **Console navigateur** pour les erreurs JavaScript
- **Firebase Console** pour les erreurs Firestore
- **Network tab** pour les erreurs d'upload
- **Logs serveur** pour les erreurs Next.js

---

**Pharmarapide Order System** - Système complet de commande et suivi 