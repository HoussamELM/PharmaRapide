# Next.js + Tailwind + Firebase + ImgBB

A complete Next.js project setup with Tailwind CSS for styling, Firebase for backend services, and ImgBB API for image uploads.

## Features

- ⚡ **Next.js 14** with App Router
- 🎨 **Tailwind CSS** for styling
- 🔥 **Firebase** integration for backend services
- 📸 **ImgBB API** for image uploads
- 📱 **Responsive design**
- 🔧 **TypeScript** support
- ✅ **ESLint** configuration

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Backend**: Firebase
- **Image Upload**: ImgBB API
- **Language**: TypeScript
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── page.tsx        # Home page
│   └── layout.tsx      # Root layout
├── components/         # React components
│   └── ImageUpload.tsx # Image upload demo component
└── lib/               # Utility libraries
    ├── firebase.ts    # Firebase configuration
    └── imgbb.ts       # ImgBB API configuration
```

## Configuration

### Firebase

Firebase is already configured with your project settings:

- **Project ID**: pharmarapide-cb1c3
- **API Key**: Configured
- **Auth Domain**: pharmarapide-cb1c3.firebaseapp.com

To use Firebase services, import from `@/lib/firebase`:

```typescript
import app from '@/lib/firebase';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
```

### ImgBB API

ImgBB API is configured with your API key. To upload images:

```typescript
import { uploadImageToImgBB } from '@/lib/imgbb';

const result = await uploadImageToImgBB(file);
console.log(result.data.url); // Image URL
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file for environment variables:

```env
# Firebase (already configured in code)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# ImgBB (already configured in code)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

## Features Demo

The project includes a demo image upload component that showcases:

- File selection
- Image upload to ImgBB
- Display of uploaded image
- Error handling
- Loading states

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

Build the project:
```bash
npm run build
```

The built files will be in the `.next` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you need help or have questions:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review [Tailwind CSS docs](https://tailwindcss.com/docs)
3. Consult [Firebase documentation](https://firebase.google.com/docs)
4. Check [ImgBB API docs](https://api.imgbb.com/)

---

Built with ❤️ using Next.js, Tailwind CSS, Firebase, and ImgBB API.
