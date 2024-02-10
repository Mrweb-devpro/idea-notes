import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  ActiveDaysBtn,
  displayMessgae,
  resetApp,
  setupAccount,
  toggleDashboard,
} from "../main";
import { clearForm } from "../compontents/Form";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// reawding the firestore dataBAse
const firebaseConfig = {
  apiKey: "AIzaSyC8y_oaEc2iZQXESczfhZ2Ao2ssqALHU6I",
  authDomain: "idea-routine-project.firebaseapp.com",
  projectId: "idea-routine-project",
  storageBucket: "idea-routine-project.appspot.com",
  messagingSenderId: "671890707999",
  appId: "1:671890707999:web:44e61a7d910ade9fff672a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// get the database
export const db = getFirestore(app);

// getting a reference to the database
// const colRef = collection(db, "users");
// const colRef_ordered = query(colRef, orderBy("time"));

/// Autentication
const auth = getAuth();

// auth status change
onAuthStateChanged(
  auth,
  function (user) {
    if (user) {
      toggleDashboard("open");
      setupAccount(user);
      // getting data
      getData(user).then(function (col) {
        let data: any[] = [];
        col.docs.forEach(function (doc) {
          data.push({ ...doc.data(), id: doc.id });
        });
        ActiveDaysBtn(data);
      });
    } else {
      displayMessgae("Sign in to open idea notes", "normal");
    }
  },
  function (err) {
    displayMessgae(extractError(err.message), "error");
  }
);

// signup
export function signup(email: string, password: string) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(function (cred) {
      const colRef = collection(db, `${cred.user.email}`);
      clearForm("signup");
      addDoc(colRef, {
        day: "01",
        content: "// TYPE WHAT YOU NEED HERE ....",
        date: new Date().toISOString(),
      });
    })
    .catch(function (err) {
      displayMessgae(extractError(err.message), "error");
    });
}

// signout
export function signout() {
  signOut(auth).then(function () {
    resetApp();
  });
}
//login
export function login(email: string, password: string) {
  signInWithEmailAndPassword(auth, email, password)
    .then(function () {
      clearForm("login");
    })
    .catch(function (err) {
      displayMessgae(extractError(err.message), "error");
    });
}
/// getting data

export function getData(user: any) {
  const docRef = getDocs(collection(db, user.email));
  return docRef;
}
//////////////////////////////////
//////////////////////////////////
// reusable functions
//////////////////////////////////

function extractError(str: string): string {
  return str.split("/")[1].replace(")", "").split("-").join(" ");
}
