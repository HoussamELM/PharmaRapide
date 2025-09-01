# Firebase Setup Instructions

## 🔧 Fixing the "Missing or insufficient permissions" Error

The error you're seeing is caused by Firebase security rules that are too restrictive. Here's how to fix it:

### 🚀 Quick Fix (Development)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `pharmarapide-cb1c3`

2. **Navigate to Firestore Database**
   - Click on "Firestore Database" in the left sidebar
   - Click on the "Rules" tab

3. **Update Security Rules**
   - Replace the existing rules with the content from `firestore.rules`
   - Click "Publish" to save the changes

### 📝 Security Rules Content

Copy and paste this into your Firebase Console Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to orders collection
    match /orders/{document} {
      allow read, write: if true;
    }
    
    // Allow read/write access to test collection (for debugging)
    match /test/{document} {
      allow read, write: if true;
    }
    
    // Deny access to all other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 🔒 Production Security Rules

For production, use the more secure rules from `firestore.rules.production`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to orders collection
    match /orders/{document} {
      allow read, write: if true;
    }
    
    // Allow admin access to all collections (for admin dashboard)
    match /{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.email in ['admin@pharmarapide.ma', 'housqwer1@gmail.com'];
    }
  }
}
```

### 🧪 Testing the Fix

After updating the rules:

1. **Wait 1-2 minutes** for rules to propagate
2. **Refresh your browser** page
3. **Try the "Debug Firebase" button** again
4. **Test order submission** with the form

### ✅ Expected Results

After fixing the rules, you should see:

```
=== Firebase Debug Test ===
✅ Firestore instance created successfully
Testing Firestore read access...
✅ Firestore read test successful, found X documents
Testing Firestore write access...
✅ Firestore write test successful, created document: abc123
Cleaning up test document...
✅ Test document cleaned up successfully
```

### 🚨 Important Notes

- **Development Rules**: Allow all access to orders collection (for testing)
- **Production Rules**: Should be more restrictive for security
- **Admin Access**: Only authorized emails can access admin features
- **Rule Propagation**: Changes take 1-2 minutes to take effect

### 🔧 Alternative: Firebase CLI

If you have Firebase CLI installed:

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### 📞 Need Help?

If you still see permission errors after updating the rules:

1. **Check Firebase Console** for any error messages
2. **Wait 2-3 minutes** for rules to fully propagate
3. **Clear browser cache** and try again
4. **Check network tab** for any failed requests

---

**The order submission should work perfectly after updating these security rules!** 🎉 