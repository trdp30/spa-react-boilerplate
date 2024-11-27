import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { catchError } from '@utils/sentry';
import { appName } from '@utils/localStorageHelpers';

interface FirebaseInstance {
  firebaseApp: object;
  fireBaseAuth: Auth;
}

export let firebaseInstance: FirebaseInstance;

export const initializeFirebase = (): FirebaseInstance | undefined => {
  try {
    const config = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_API_DOMAIN,
    };
    const app = initializeApp(config, { name: appName });
    const auth = getAuth(app);
    firebaseInstance = {
      firebaseApp: app,
      fireBaseAuth: auth,
    };
    return firebaseInstance;
  } catch (error) {
    catchError({ title: 'Firebase initialization', error: error as Error });
    return;
  }
};

export default initializeFirebase;
