// Get authorized admin emails from environment variables
const getAuthorizedEmailsFromEnv = (): string[] => {
  const envEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  if (envEmails) {
    return envEmails.split(',').map(email => email.trim().toLowerCase());
  }
  
  // Fallback to hardcoded emails (for development only)
  return [
    'admin@pharmarapide.ma', // Replace with your actual admin email
    // Add more admin emails here if needed
  ];
};

const AUTHORIZED_ADMIN_EMAILS = [
    'housqwer1@gmail.com',    // Your admin email
  ];

export const isAuthorizedAdmin = (email: string | null): boolean => {
  if (!email) return false;
  return AUTHORIZED_ADMIN_EMAILS.includes(email.toLowerCase());
};

export const getAuthorizedEmails = (): string[] => {
  return [...AUTHORIZED_ADMIN_EMAILS];
};

// For development purposes only - remove in production
export const isDevelopmentMode = (): boolean => {
  return process.env.NODE_ENV === 'development';
}; 