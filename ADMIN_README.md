# Pharmarapide Admin Dashboard

Un tableau de bord administrateur sécurisé pour gérer les commandes de médicaments.

## 🔒 Sécurité Renforcée

### 🔐 Authentification Restreinte
- **Accès limité** : Seuls les emails autorisés peuvent se connecter
- **Liste blanche** : Configuration via variables d'environnement
- **Accès caché** : Lien admin discret dans le footer
- **Protection automatique** : Déconnexion des utilisateurs non autorisés

### 🛡️ Protection des Routes
- **Middleware** : Vérification des routes admin
- **Authentification côté client** : Redirection automatique
- **Firebase Auth** : Gestion sécurisée des sessions
- **Vérification d'autorisation** : Contrôle des emails autorisés

## 🚀 Fonctionnalités

### 🔐 Authentification
- **Google Sign-in** via Firebase Auth
- **Routes protégées** - Seuls les admins autorisés peuvent accéder
- **Redirection automatique** vers la page de connexion si non authentifié
- **Liste blanche d'emails** pour contrôler l'accès

### 📋 Gestion des Commandes
- **Vue liste** de toutes les commandes avec filtrage par statut
- **Détails complets** de chaque commande
- **Mise à jour des statuts** : En attente → Validée → Livrée
- **Image d'ordonnance** (si téléchargée)
- **Bouton d'appel** direct vers le client

### 🎨 Interface
- **Design responsive** (mobile, tablet, desktop)
- **Sidebar** avec navigation
- **Tableau moderne** avec tri et filtres
- **Statuts colorés** pour une identification rapide

## 📁 Structure des Fichiers

```
src/
├── app/
│   └── admin/
│       ├── page.tsx          # Dashboard principal
│       └── login/
│           └── page.tsx      # Page de connexion
├── components/
│   └── admin/
│       ├── AdminSidebar.tsx  # Barre latérale
│       ├── OrdersList.tsx    # Liste des commandes
│       └── OrderDetails.tsx  # Détails d'une commande
├── lib/
│   └── adminAuth.ts          # Logique d'autorisation admin
└── middleware.ts             # Protection des routes
```

## 🔧 Configuration

### Variables d'Environnement
Créez un fichier `.env.local` dans le répertoire racine :

```env
# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAILS=admin@pharmarapide.ma,your-email@gmail.com

# Firebase Configuration (déjà configuré)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### Configuration des Emails Autorisés
```typescript
// Dans src/lib/adminAuth.ts
const AUTHORIZED_ADMIN_EMAILS = [
  'admin@pharmarapide.ma',    // Email principal
  'manager@pharmarapide.ma',  // Email secondaire
  // Ajoutez d'autres emails si nécessaire
];
```

## 🎯 Utilisation

### 1. Accès au Dashboard
- **Méthode 1** : Visitez directement `/admin`
- **Méthode 2** : Cliquez sur le lien "Admin" discret dans le footer
- **Sécurité** : Si non connecté, redirection vers `/admin/login`
- **Autorisation** : Seuls les emails autorisés peuvent se connecter

### 2. Gestion des Commandes
- **Vue liste** : Voir toutes les commandes avec filtres
- **Cliquer sur "Voir détails"** : Ouvrir les détails d'une commande
- **Actions disponibles** :
  - `Confirmer la commande` : Statut → "Validée"
  - `Commande livrée` : Statut → "Livrée"
  - `Appeler` : Appel direct au client

### 3. Filtrage
- **Tous les statuts** : Voir toutes les commandes
- **En attente** : Commandes non traitées
- **Validées** : Commandes confirmées
- **Livrées** : Commandes terminées

## 🧪 Test du Dashboard

### Créer des Commandes Test
1. Visitez la page d'accueil
2. Utilisez le formulaire "Test Admin Dashboard"
3. Créez des commandes avec différents statuts
4. Testez le dashboard admin

### Exemple de Commande Test
```json
{
  "nomComplet": "Ahmed Benali",
  "telephone": "+212600000000",
  "adresse": "123 Rue Hassan II, Casablanca",
  "prescriptionUrl": "https://example.com/prescription.jpg",
  "statut": "pending",
  "dateCreation": "2024-01-15T10:30:00Z"
}
```

## 🔒 Sécurité Avancée

### Protection des Routes
- **Middleware** : Vérification des routes admin
- **Authentification côté client** : Redirection automatique
- **Firebase Auth** : Gestion sécurisée des sessions
- **Vérification d'email** : Contrôle des autorisations

### Accès Restreint
- **Liste blanche** : Seuls les emails autorisés peuvent accéder
- **Session persistante** avec Firebase
- **Déconnexion automatique** des utilisateurs non autorisés
- **Accès caché** : Lien admin discret dans le footer

### Messages d'Erreur
- **Accès non autorisé** : Message clair pour les utilisateurs non autorisés
- **Liste des emails autorisés** : Affichée sur la page de connexion
- **Redirection automatique** : Vers l'accueil si non autorisé

## 📱 Responsive Design

### Desktop (≥1024px)
- Sidebar fixe à gauche
- Tableau complet avec toutes les colonnes
- Actions en ligne

### Tablet (768px - 1023px)
- Sidebar adaptée
- Tableau avec scroll horizontal
- Boutons adaptés

### Mobile (<768px)
- Navigation hamburger
- Vue liste simplifiée
- Boutons tactiles optimisés

## 🎨 Personnalisation

### Couleurs
- **Vert principal** : `#4CAF50` (Pharmarapide)
- **Statuts** :
  - En attente : Jaune (`#F59E0B`)
  - Validée : Bleu (`#3B82F6`)
  - Livrée : Vert (`#10B981`)

### Typographie
- **Titres** : Font-bold, tailles responsives
- **Texte** : Gray-900 pour le contenu principal
- **Labels** : Gray-700 pour les étiquettes

## 🚀 Déploiement

### Variables d'Environnement
```env
# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAILS=admin@pharmarapide.ma

# Firebase (déjà configuré)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### Build et Déploiement
```bash
npm run build
npm run start
```

## 🔧 Maintenance

### Ajouter de Nouveaux Admins
1. Ajoutez l'email dans `NEXT_PUBLIC_ADMIN_EMAILS` (variables d'environnement)
2. Ou modifiez `src/lib/adminAuth.ts` pour le développement
3. Redémarrez l'application

### Mise à Jour des Statuts
Les statuts sont gérés dans Firestore et mis à jour en temps réel :
- `pending` : Commande reçue, en attente de validation
- `validated` : Commande confirmée, en cours de préparation
- `delivered` : Commande livrée au client

## 📞 Support

Pour toute question ou problème :
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous que Firebase est correctement configuré
- Vérifiez que votre email est dans la liste des autorisés
- Testez la connexion internet et l'accès à Firebase

## 🔐 Sécurité en Production

### Recommandations
1. **Utilisez des variables d'environnement** pour les emails autorisés
2. **Limitez l'accès** aux emails de confiance uniquement
3. **Surveillez les tentatives de connexion** dans Firebase Console
4. **Changez régulièrement** les emails autorisés si nécessaire
5. **Utilisez HTTPS** en production

---

**Pharmarapide Admin Dashboard** - Gestion sécurisée des commandes de médicaments 