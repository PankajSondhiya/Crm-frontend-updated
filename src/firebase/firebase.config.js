import { initializeApp } from "firebase/app";
import { createContext, useContext } from "react";
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA1fmYTeb7l74nBYouk4YKSCVkmKKrcYtA",
  authDomain: "crmapp-2bfbb.firebaseapp.com",
  projectId: "crmapp-2bfbb",
  storageBucket: "crmapp-2bfbb.appspot.com",
  messagingSenderId: "904778235455",
  appId: "1:904778235455:web:e81ebd860f9c4388fd028a",
};
const FirebaseContext = createContext(null);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const firebaseSignUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const firebaseSignIn = (email, password) => {
    console.log(email, password);
    return signInWithEmailAndPassword(auth, email, password);
  };
  const sendVerficationEmail = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const changePassword = (oobcode, newpassword) => {
    console.log(oobcode, newpassword);
    return confirmPasswordReset(auth, oobcode, newpassword);
  };
  return (
    <FirebaseContext.Provider
      value={{
        firebaseSignIn,
        firebaseSignUp,
        sendVerficationEmail,
        changePassword,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
