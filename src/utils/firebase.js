import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

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
    console.log("userAuth: " + userAuth);
    console.log("additionalData: " + additionalData);
    const { email } = userAuth;
    const profilePictureURL = null;
    const tel = null;
    const medicalRecord = null;
    const location = null;

    const createdAt = new Date();

    try {
      const { role, firstName, lastName } = additionalData;
      if (role === "Pacient") {
        const { pacientBirthDate } = additionalData;

        await userRef.set({
          firstName,
          lastName,
          email,
          role,
          pacientBirthDate,
          createdAt,
          profilePictureURL,
          tel,
          medicalRecord,
        });
      } else if (role === "Medic") {
        const { medicInstitution, medicFunction } = additionalData;

        await userRef.set({
          firstName,
          lastName,
          email,
          role,
          medicInstitution,
          medicFunction,
          createdAt,
          profilePictureURL,
          tel,
          location,
        });
      }
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return userRef;
};

export const updateUserProfileDocument = async (userAuth, additionalData) => {
  console.log("userAuth: " + userAuth.id);
  if (!userAuth) {
    return true;
  }
  const userRef = firestore.doc(`users/${userAuth.id}`);
  // console.log(JSON.stringify(userRef, null, 2));
  const snapShot = await userRef.get();
  // console.log(JSON.stringify(snapShot, null, 2));
  if (snapShot.exists) {
    const { role } = additionalData;

    try {
      const { firstName, lastName, tel, profilePictureURL, location } =
        additionalData;
      console.log(
        "firstname " +
          firstName +
          "\nlastName " +
          lastName +
          "\ntel " +
          tel +
          "\nprofilePicture " +
          profilePictureURL +
          "\nrole " +
          role
      );
      if (role === "Pacient") {
        await userRef.update({
          firstName: firstName,
          lastName: lastName,
          profilePictureURL: profilePictureURL,
          tel: tel,
        });
      } else if (role === "Medic") {
        const { medicInstitution, medicFunction } = additionalData;

        await userRef.update({
          firstName: firstName,
          lastName: lastName,
          profilePictureURL: profilePictureURL,
          tel: tel,
          medicFunction: medicFunction,
          medicInstitution: medicInstitution,
          location: location,
        });
      }
    } catch (error) {
      console.log("error updating user profile", error.message);
    }
  }
  return false;
};

export const updateUserProfilePicture = async (userAuth, file) => {
  var profilePictureURL = null;
  if (file && userAuth) {
    const storageRef = firebase
      .storage()
      .ref("ProfilePictures/" + userAuth.id + "/" + file.name);
    console.log(storageRef);

    await storageRef.put(file);

    await storageRef.getDownloadURL().then((url) => {
      profilePictureURL = url;
    });

    return profilePictureURL;
  }
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
