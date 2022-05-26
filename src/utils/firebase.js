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
    const { email } = userAuth;
    const profilePictureURL = null;
    const tel = null;
    const location = null;
    const createdAt = new Date();

    const gen = null;
    const medicalRecord = [];
    const înălțime = null;
    const greutate = null;

    try {
      const { role, firstName, lastName } = additionalData;
      if (role === "Pacient") {
        const { pacientBirthDate } = additionalData;

        await userRef.set({
          firstName,
          lastName,
          email,
          myMedicsPending: [],
          myMedicsAllowed: [],
          role,
          pacientBirthDate,
          createdAt,
          profilePictureURL,
          comorbidități: [],
          tel,
          gen,
          înălțime,
          greutate,
          medicalRecord,
        });
      } else if (role === "Medic") {
        const { medicInstitution, medicFunction } = additionalData;

        await userRef.set({
          firstName,
          myPatientsPending: [],
          myPatientsAllowed: [],
          lastName,
          email,
          role,
          medicInstitution,
          medicFunction,
          createdAt,
          profilePictureURL,
          tel,
          location,
          orar: {
            luni: null,
            marti: null,
            miercuri: null,
            joi: null,
            vineri: null,
            sambata: null,
            duminica: null,
          },
          specializari: {
            specializare1: null,
            specializare2: null,
            specializare3: null,
          },
          experienta: {
            experienta1: null,
            experienta2: null,
            experienta3: null,
          },
          facultate: null,
          anulAbsolvirii: null,
        });
      }
    } catch (error) {
      alert(error.message);
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

      if (role === "Pacient") {
        const { înălțime, greutate, gen, comorbidități } = additionalData;
        await userRef.update({
          firstName: firstName,
          lastName: lastName,
          profilePictureURL: profilePictureURL,
          tel: tel,
          înălțime: înălțime,
          greutate: greutate,
          gen: gen,
          comorbidități: comorbidități,
        });
      } else if (role === "Medic") {
        const {
          medicInstitution,
          medicFunction,
          orar,
          specializari,
          facultate,
          anulAbsolvirii,
          experienta,
        } = additionalData;

        await userRef.update({
          firstName: firstName,
          lastName: lastName,
          profilePictureURL: profilePictureURL,
          tel: tel,
          medicFunction: medicFunction,
          medicInstitution: medicInstitution,
          location: location,
          orar: orar,
          specializari: specializari,
          facultate: facultate,
          anulAbsolvirii: anulAbsolvirii,
          experienta: experienta,
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

export const getUsersByRole = async (role, idRole) => {
  const filteredUsers = [];
  const users = await firebase
    .firestore()
    .collection("users")
    .where("role", "==", role)
    .get();

  users.forEach((doc) => {
    const docData = doc.data();
    docData[idRole] = doc.id;
    filteredUsers.push(docData);
  });

  return filteredUsers;
};

export const createMedicalEvent = async (userAuth, medicalEventData) => {
  if (userAuth && medicalEventData) {
    const userRef = firestore.doc(`users/${userAuth.id}`);
    const snapShot = await userRef.get();
    if (snapShot.exists) {
      try {
        await userRef.update({
          medicalRecord:
            firebase.firestore.FieldValue.arrayUnion(medicalEventData),
        });
      } catch (error) {
        alert("error pushing medical event into de database: " + error);
      }
    }
  }
};

export const sendRequest = async (medicId, pacientId) => {
  if (medicId && pacientId) {
    const pacientRef = await firestore.doc(`users/${pacientId}`);
    const medicRef = await firestore.doc(`users/${medicId}`);

    try {
      await pacientRef.update({
        myMedicsPending: firebase.firestore.FieldValue.arrayUnion(medicId),
      });
      await medicRef.update({
        myPatientsPending: firebase.firestore.FieldValue.arrayUnion(pacientId),
      });
    } catch (err) {
      alert("error sending request" + err.message);
    }
  }
};

export const cancelRequest = async (medicId, pacientId) => {
  if (medicId && pacientId) {
    const pacientRef = await firestore.doc(`users/${pacientId}`);
    const medicRef = await firestore.doc(`users/${medicId}`);

    try {
      await medicRef.update({
        myPatientsPending: firebase.firestore.FieldValue.arrayRemove(pacientId),
      });
      await pacientRef.update({
        myMedicsPending: firebase.firestore.FieldValue.arrayRemove(medicId),
      });
    } catch (err) {
      alert("error canceling request" + err.message);
    }
  }
};

export const cancelRequest1 = async (medicId, pacientId) => {
  if (medicId && pacientId) {
    const pacientRef = await firestore.doc(`users/${pacientId}`);
    const medicRef = await firestore.doc(`users/${medicId}`);

    try {
      await pacientRef.update({
        myMedicsPending: firebase.firestore.FieldValue.arrayRemove(medicId),
      });
      await medicRef.update({
        myPatientsPending: firebase.firestore.FieldValue.arrayRemove(pacientId),
      });
    } catch (err) {
      alert("error canceling request" + err.message);
    }
  }
};

export const acceptRequest = async (medicId, pacientId) => {
  if (medicId && pacientId) {
    const pacientRef = await firestore.doc(`users/${pacientId}`);
    const medicRef = await firestore.doc(`users/${medicId}`);

    try {
      await medicRef.update({
        myPatientsPending: firebase.firestore.FieldValue.arrayRemove(pacientId),
      });
      await pacientRef.update({
        myMedicsPending: firebase.firestore.FieldValue.arrayRemove(medicId),
      });
      await medicRef.update({
        myPatientsAllowed: firebase.firestore.FieldValue.arrayUnion(pacientId),
      });
      await pacientRef.update({
        myMedicsAllowed: firebase.firestore.FieldValue.arrayUnion(medicId),
      });
    } catch (err) {
      alert("error accepting request" + err.message);
    }
  }
};

export const denyAccess = async (medicId, pacientId) => {
  if (medicId && pacientId) {
    const pacientRef = await firestore.doc(`users/${pacientId}`);
    const medicRef = await firestore.doc(`users/${medicId}`);

    try {
      await medicRef.update({
        myPatientsAllowed: firebase.firestore.FieldValue.arrayRemove(pacientId),
      });
      await pacientRef.update({
        myMedicsAllowed: firebase.firestore.FieldValue.arrayRemove(medicId),
      });
    } catch (err) {
      alert("error canceling request" + err.message);
    }
  }
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
