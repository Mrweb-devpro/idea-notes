import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
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
import { GoogleAuthProvider } from "firebase/auth/cordova";
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
const db = getFirestore(app);
// getting a reference to the database
// const colRef = collection(db, "users");
// const colRef_ordered = query(colRef, orderBy("time"));

/// Autentication
const auth = getAuth(app);
auth.languageCode = "en";

// FireBase Auth PRovider
const provider = new GoogleAuthProvider();

// auth status change
onAuthStateChanged(
  auth,
  function (user) {
    if (user) {
      toggleDashboard("open");
      setupAccount(user);

      onSnapshot(
        getData(user),
        function (snapshot) {
          let data: any[] = [];
          snapshot.docs.forEach(function (doc) {
            data.push({ ...doc.data(), id: doc.id });
          });
          ActiveDaysBtn(data);
        },
        function (err) {
          displayMessgae(extractError(err.message), "error");
        }
      );
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
      const colRef = collection(db, `USERS/${cred.user.uid}/userData`);
      clearForm("signup");
      addDoc(colRef, {
        day: "01",
        content: "// TYPE SOMETHING  ....",
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

// google Auth
export function signupWithGoogle() {
  signInWithRedirect(auth, provider);
}
/// getting data

export function getData(user: any) {
  // const docRef = getDocs(collection(db, `USERS/${user.uid}/userData`));
  const colRef = collection(db, `USERS/${user.uid}/userData`);
  const orderColRef = query(colRef, orderBy("day"));
  return orderColRef;
}
// updateing dos

export function updateData(
  activeBtn: HTMLButtonElement,
  textarea: HTMLTextAreaElement,
  modifiedDate: HTMLElement
) {
  modifiedDate.innerHTML = new Date().toDateString();
  updateDoc(
    doc(
      db,
      `USERS/${auth.currentUser?.uid}/userData`,
      `${activeBtn.getAttribute("data-id")}`.trim()
    ),
    { content: textarea.value, date: new Date().toISOString() }
  )
    .then(function () {
      displayMessgae("SAVED", "success");
    })
    .catch(function (err) {
      displayMessgae(err.message, "error");
    });
}

export function addData(newDay: number) {
  if (auth.currentUser) {
    const colRef = collection(db, `USERS/${auth.currentUser?.uid}/userData`);

    addDoc(colRef, {
      day: `0${newDay}`,
      content: "// TYPE SOMETHING  ....",
      date: new Date().toISOString(),
    });
  }
}
//////////////////////////////////
//////////////////////////////////
// reusable functions
//////////////////////////////////

function extractError(str: string): string {
  return str.split("/")[1].replace(")", "").split("-").join(" ");
}
