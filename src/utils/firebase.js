import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCp-F2oyrGF1ThSajj0V4ROs-VYKcnkbN4",
  authDomain: "mymedicalrecord-a82bb.firebaseapp.com",
  projectId: "mymedicalrecord-a82bb",
  storageBucket: "mymedicalrecord-a82bb.appspot.com",
  messagingSenderId: "429275889421",
  appId: "1:429275889421:web:1bfb67005dd85ead897a44",
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) {
    return;
  }
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();
  if (!snapShot.exists) {
    const { displayName, email } = userAuth;

    const createdAt = new Date();

    try {
      // if (role === "Medic") {
      //   await userRef.set({
      //     firstName,
      //     lastName,
      //     createdAt,
      //     email,
      //     role,
      //     medicInstitution,
      //     medicFunction,
      //     ...additionalData,
      //   });
      // } else if (role === "Pacient") {
      //   await userRef.set({
      //     firstName,
      //     lastName,
      //     createdAt,
      //     email,
      //     role,
      //     pacientBirthDate,
      //     ...additionalData,
      //   });
      // }

      await userRef.set({
        displayName,
        email,
        createdAt,
        abbbb: "aaaaa",
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return userRef;
};
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
