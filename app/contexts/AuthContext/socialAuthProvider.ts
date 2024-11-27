import { GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from 'firebase/auth';

export const socialLoginProviders = {
  google: new GoogleAuthProvider(),
  facebook: new FacebookAuthProvider(),
  apple: new OAuthProvider('apple.com'),
  microsoft: new OAuthProvider('microsoft.com'),
};

export const getAuthProvider = (name: string) => {
  switch (name) {
    case 'facebook':
      return FacebookAuthProvider;
    case 'google':
      return GoogleAuthProvider;
    case 'apple':
      return OAuthProvider;
    case 'microsoft':
      return OAuthProvider;
    default:
      return '';
  }
};
